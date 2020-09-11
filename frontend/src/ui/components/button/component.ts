import Component from '@glimmer/component';
import { action } from '@ember/object';
// import TooltipComponent from 'frontend/src/utils/decorators/tooltip-component';

// @TooltipComponent
export default class Button extends Component<{
  form?: any;
  type?: string;
  style?: string;
  circle?: boolean;
  block?: boolean;
  muted?: boolean;
  outline?: boolean;
  size?: string;
  bubbles?: boolean;
  onClick?: () => {};
}> {
  get form() {
    return this.args.form;
  }

  get type() {
    return this.args.type || 'button';
  }

  get style() {
    return this.args.style || 'primary';
  }

  get circleClass() {
    return this.args.circle ? `btn-circle` : '';
  }

  get blockClass() {
    return this.args.block ? 'btn-block' : '';
  }

  get styleClass() {
    if (this.args.muted) {
      return `btn-${this.style}-muted`;
    } else if (this.args.outline) {
      return `btn-outline-${this.style}`;
    } else {
      return `btn-${this.style}`;
    }
  }

  get sizeClass() {
    switch (this.args.size) {
      case 'xs':
        return 'btn-xs';
      case 'sm':
        return 'btn-sm';
      case 'lg':
        return 'btn-lg';
      default:
        return '';
    }
  }

  @action
  clickHandler(event: Event) {
    event.preventDefault();

    if (this.args.bubbles === false) {
      event.stopPropagation();
    }

    this.args.onClick ? this.args.onClick() : null;

    if (this.type === 'submit' && this.form) {
      this.form.handleSubmit(event);
    }
  }
}
