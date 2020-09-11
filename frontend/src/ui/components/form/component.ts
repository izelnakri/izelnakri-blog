import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { underscore } from '@ember/string';
import { action } from '@ember/object';

export default class Form extends Component<{
  model: any;
  beforeSubmit?: (model) => {};
  afterSubmit?: (model) => {};
  onSuccess?: (model) => {};
  onError?: (model) => {};
  submitHandler?: () => {};
  showSuccessFlashMessage?: boolean;
  showErrorFlashMessage?: boolean;
}> {
  @service i18n;
  @service flashMessages;
  @tracked isLoading = false;

  get submitHandler() {
    return 'submitHandler' in this.args ? this.args.submitHandler : true;
  }

  get showSuccessFlashMessage() {
    return 'showSuccessFlashMessage' in this.args ? this.args.showSuccessFlashMessage : true;
  }

  get showErrorFlashMessage() {
    return 'showErrorFlashMessage' in this.args ? this.args.showErrorFlashMessage : true;
  }

  @action
  handleSubmit(event) {
    event.preventDefault();
    const model = this.args.model;

    if (this.args.beforeSubmit) {
      this.args.beforeSubmit(model);
    }

    if (this.submitHandler) {
      const constructorName = model.constructor.modelName;
      const modelName = constructorName ? underscore(constructorName) : null;

      this.isLoading = true;

      model
        .save()
        .then((model) => {
          if (this.showSuccessFlashMessage) {
            this.flashMessages.success(this.i18n.t(`models.${modelName}.saved`));
          }

          return this.args.onSuccess ? this.args.onSuccess(model) : null;
        })
        .catch((error) => {
          if (this.showErrorFlashMessage) {
            this.flashMessages.danger(this.i18n.t(`models.${modelName}.save_error`));
          }

          window.Raven.captureMessage(error);

          return this.args.onError ? this.args.onError(model) : null;
        })
        .finally(() => {
          this.isLoading = false;

          return this.args.afterSubmit ? this.args.afterSubmit(model) : null;
        });
    }
  }
}
