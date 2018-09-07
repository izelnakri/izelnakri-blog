import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  i18n: service(),
  flashMessages: service(),

  tagName: 'form',
  classNameBindings: [':in-form'],
  isLoading: false,
  submitHandler: true,
  submit(event) {
    event.preventDefault();

    const model = this.get('model');

    if (this.get('beforeSubmit')) {
      this.get('beforeSubmit')(model);
    }

    if (this.get('submitHandler')) {
      this.set('isLoading', true);

      model.save().then((model) => {
        this.flashMessages.success(this.get('i18n').t('components.in-form.success'));

        return this.get('onSuccess') ? this.get('onSuccess')(model) : undefined;
      }).catch((error) => {
        this.flashMessages.danger(this.get('i18n').t('components.in-form.failure'));
        window.Raven.captureMessage(error);
        return this.get('onError') ? this.get('onError')(model) : undefined;
      }).finally(() => {
        this.set('isLoading', false);
      });
    }

    return this.get('afterSubmit') ? this.get('afterSubmit')(model) : undefined;
  }
});
