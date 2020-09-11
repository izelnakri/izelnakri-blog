import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, get } from '@ember/object';
import { run } from '@ember/runloop';

class FormWrapper extends Component<{
  model: { [prop: string]: any },
  attribute: string,
  name: string,
  hasPlaceholder?: boolean,
  hasAddonLeft?: boolean,
  addonLeft?: string,
  displayLabel?: string,
  placeholder?: string,
}> {
  @tracked placeholder;
  @tracked labelClass;

  get hasAddonLeft() {
    return this.args.hasAddonLeft || this.args.addonLeft;
  }

  get value() {
    return this.args.model ? get(this.args.model, this.args.attribute) : null;
  }

  // NOTE: maybe add this.model here and this.attribute
  get hasPlaceholder() {
    return (!this.displayLabel && this.placeholder) || this.args.hasPlaceholder;
  }

  get displayLabel() {
    return (
      this.errorMessage ||
      !this.placeholder ||
      get(this.args.model, this.args.attribute) ||
      this.args.displayLabel
    );
  }

  get errorMessage() {
    if (this.args.model && this.args.model.errors) {
      const errors = this.args.model.errors.errorsFor(this.args.attribute);

      if (errors[0]) {
        run.later(() => {
          this.placeholder = null;
        }, null);

        return errors[0].message;
      }
    }

    return null;
  }

  @action
  registerActions(element) {
    const input = element.querySelector('input') || element.querySelector('textarea');
    const elementIsSelect = !input && element.querySelector('select');

    if (!elementIsSelect) {
      input.addEventListener('keyup', this.keyUp);
      input.addEventListener('focusin', this.focusIn);
      input.addEventListener('focusout', this.focusOut);
    }
  }

  @action
  deregisterActions(element) {
    const input = element.querySelector('input') || element.querySelector('textarea');
    const elementIsSelect = !input && element.querySelector('select');

    if (!elementIsSelect) {
      input.removeEventListener('keyup', this.keyUp);
      input.removeEventListener('focusin', this.focusIn);
      input.removeEventListener('focusout', this.focusOut);
    }
  }

  constructor(owner, args) {
    super(owner, args);

    if (!this.args.model) {
      throw new Error('<Form::Wrapper/> created without @model attribute!');
    } else if (!this.args.attribute) {
      throw new Error('<Form::Wrapper/> created without @attribute attribute!');
    }

    this.placeholder = this.args.placeholder;
  }

  @action
  keyUp() {
    if (this.args.model.errors) {
      const errors = this.args.model.errors.errorsFor(this.args.attribute);

      errors ? errors.clear() : null;
    }
  }

  @action
  focusIn() {
    const removePlaceholder = () => {
      this.placeholder = null;
      this.labelClass = 'is-active';
    };

    run.once(this, removePlaceholder);
  }

  @action
  focusOut() {
    const decideIfPlaceholderShouldBeShown = () => {
      if (!this.errorMessage) {
        this.placeholder = this.args.placeholder;
      }

      this.labelClass = null;
    };

    run.once(this, decideIfPlaceholderShouldBeShown);
  }
}

export default FormWrapper;
