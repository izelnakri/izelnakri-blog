import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  modals: service(),

  init() {
    this._super(...arguments);

    this.set('model', Object.assign({
      title: 'Are you sure?',
      text: 'Are you sure you want to do this?'
    }, this.model));
  },
  actions: {
    confirm() {
      this.modals.close();
      this.modals.promise.resolve();
    },
    cancel() {
      this.modals.close();
      this.modals.promise.reject();
    }
  }
});
