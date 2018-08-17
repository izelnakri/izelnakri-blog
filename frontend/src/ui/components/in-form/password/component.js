import Component from '@ember/component';
import { computed } from '@ember/object';
import FormComponentMixin from 'frontend/src/utils/mixins/form-component';

export default Component.extend(FormComponentMixin, {
  classNames: ['form-group', 'has-addon-left'],
  placeholder: computed(function() {
    return this.i18n.t('components.input-password.placeholder');
  }),
  inputType: 'password',
  required: true,
  keyUp() {
    this.model.set(this.attribute, this.$('input').val());
  },
  change() {
    this.model.set(this.attribute, this.$('input').val());
  },
  actions: {
    changeInputType() {
      if (this.inputType === 'password') {
        return this.set('inputType', 'text');
      }

      this.set('inputType', 'password');
    },
    addonClick() {
      this.$().find('input').first().focus();
    }
  }
});
