import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import FormComponent from 'frontend/src/utils/base-classes/form-component';

export default class Password extends FormComponent<{
  form: any;
  model: any;
  attribute: string;
  placeholder?: string;
  onAddonClick?: () => {};
  required?: boolean;
}> {
  @tracked inputType = 'password';

  get placeholder() {
    return this.args.placeholder || this.i18n.t('components.form.password.placeholder');
  }

  get required() {
    return 'required' in this.args ? this.args.required : true;
  }

  @action
  changeInputType() {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }

  @action
  addonClick() {
    if (this.args.onAddonClick) {
      this.args.onAddonClick();
    }

    event.target.parentElement.parentElement.parentElement.querySelector('input').focus();
  }
}
