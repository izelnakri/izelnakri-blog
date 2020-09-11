// @ts-nocheck
import RSVP from 'rsvp';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import ENV from 'frontend/config/environment';

export default function PaginationMixin(Class) {
  return class PaginationMixinedClass extends Class {
    @service store;
    @service http;

    @tracked allowDownPagination = true;

    @tracked paginating: false;
    @tracked currentPage = 1;

    lineForFetchingDownPagination = 0.8;
    lineForFetchingUpPagination = 0.6;
    scrollPaginationDebounceTime = 1500; // NOTE: test if this impacts test performance
    totalModels = null; // NOTE: derive from args? // TODO: important totalModels important meta tag in the api

    get itemsPerPage() {
      return this.args ? this.args.itemsPerPage || 25 : null;
    }

    constructor() {
      super(...arguments);

      this.model = this.args.model;
      this.paginationContext = this.args.paginationContext || 'paginationContext';
      this.appendOn = this.args.appendOn;
      this.params = this.args.params || {};
    }

    get shownItems() {
      return this.model;
    }

    @action
    registerScrollListener(element) {
      this.element = element;
      element.addEventListener('scroll', this.paginateDown);
    }

    @action
    deregisterScrollListener(element) {
      element.removeEventListener('scroll', this.paginateDown);
    }

    @action
    paginateDown() {
      if (this.allowDownPagination) {
        const actualHeightOfTheElement = this.element.scrollHeight;
        const style = window.getComputedStyle(this.element, null);
        const height =
          this.element.clientHeight -
          parseInt(style.getPropertyValue('padding-top')) -
          parseInt(style.getPropertyValue('padding-bottom'));
        const bottomBorderOffset = this.element.scrollTop + height;
        const elementWithinTheRange =
          actualHeightOfTheElement * this.lineForFetchingDownPagination < bottomBorderOffset;

        if (elementWithinTheRange) {
          run(() => {
            this.paginating = true;
            this.allowDownPagination = false;
          });

          const timeout = window.setTimeout(
            () => (this.allowDownPagination = true),
            this.scrollPaginationDebounceTime
          );
          let params = Object.assign(this.params, { min_id: this.model.mapBy('id').pop() });

          delete params.max_id;

          return this.paginate(params).then(() => window.clearTimeout(timeout));
        }
      }
    }

    // NOTE: needs @action ?
    processResults(result) {
      if (result.length > 0) {
        this.currentPage = this.params.page + 1;
      }

      return (this.allowDownPagination = !(result.length < this.itemsPerPage));
    }

    @action
    paginate(params, pagesToPaginate = 1) {
      return new RSVP.Promise((resolve) => {
        this.params = Object.assign(this.params, params, {
          page: this.currentPage + pagesToPaginate,
        });

        if (this.endpoint) {
          this.http.get(`${ENV.APP.API_HOST}/${this.endpoint}`, this.params).then((result) => {
            run(() => {
              const appendOn = this.appendOn;
              const targetData = appendOn ? result[appendOn] : result;

              this.processResults(targetData);
              this.model.setObjects(this.model.concat(targetData).uniqBy('id'));
              this.paginating = false;

              resolve(this.model);
            });
          });
        } else {
          const modelName = this.model.type
            ? this.model.type.modelName
            : this.model[0].constructor.modelName;

          this.store.query(modelName, this.params).then((result) => {
            const initialArray = this.model.content || this.model;

            this.processResults(result);
            this.model.setObjects(initialArray.concat(result.toArray()).uniqBy('id'));
            this.paginating = false;

            resolve(this.model);
          });
        }
      });
    }
  };
}
