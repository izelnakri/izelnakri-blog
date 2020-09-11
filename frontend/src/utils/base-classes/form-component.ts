import Component from '@glimmer/component';
import { action, get, set } from '@ember/object';
import { underscore } from '@ember/string';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';

export interface FormComponentArguments {
  model: any;
  form: any;
  attribute: string;
  placeholder?: string;
  label?: any;
  required?: boolean;
  addonLeft?: any;
  addonRight?: any;
  onInput?: () => {};
}

export default class FormComponent<T extends FormComponentArguments> extends Component<T> {
  @service i18n;

  get model() {
    return this.args.model || (this.args.form ? this.args.form.args.model : null);
  }

  get attribute() {
    return this.args.attribute;
  }

  get value() {
    return this.model ? get(this.model, this.attribute) : null;
  }

  get required() {
    return this.args.required || false;
  }

  get placeholder() {
    return this.args.placeholder || this.label;
  }

  get label() {
    if (this.args.label) {
      return this.args.label;
    }

    const modelName = this.model && this.model.constructor.modelName;

    if (modelName) {
      return this.i18n.t(`models.${modelName}.${underscore(this.attribute)}`);
    }

    return '';
  }

  get name() {
    const constructorName = this.model && this.model.constructor.modelName;
    const modelName = constructorName ? underscore(constructorName) : null;
    const attributeName = this.attribute && underscore(this.attribute);

    return modelName ? `${modelName}.${attributeName}` : attributeName;
  }

  get inputId() {
    return this.name;
  }

  get inputGroup() {
    return this.args.addonLeft || this.args.addonRight;
  }

  get onInput() {
    return this.args.onInput || function () {};
  }

  constructor(owner, args) {
    super(owner, args);

    if (!this.model) {
      throw new Error('Model reference missing in one of the form components!!');
    } else if (!this.attribute) {
      throw new Error('Attribute reference is missing in one of the form components!!');
    }
  }

  @action
  changeValue(event) {
    set(this.model, this.attribute, event.target.value);
    debounce(this, 'onInput', window.runningTests ? 10 : 400);
  }
}
