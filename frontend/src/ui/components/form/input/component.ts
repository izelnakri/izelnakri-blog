import FormComponent from 'frontend/src/utils/base-classes/form-component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class Input extends FormComponent<{
  model: any,
  form: any,
  attribute: string,
  addonLeft?: string,
  addonRight?: string,
  autofocus?: boolean,
  onAddonClick?: () => {},
}> {
  @tracked autofocus;

  get addonLeftIsIcon() {
    return this.args.addonLeft && this.args.addonLeft.startsWith('fas-');
  }

  get addonRightIsIcon() {
    return this.args.addonRight && this.args.addonRight.startsWith('fas-');
  }

  get addonLeftIcon() {
    return this.addonLeftIsIcon ? this.args.addonLeft.slice(4) : null;
  }

  get addonRightIcon() {
    return this.addonRightIsIcon ? this.args.addonRight.slice(4) : null;
  }

  @action
  autofocusOnlyOnMobile(element) {
    this.autofocus = this.args.autofocus;

    const phoneRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobile = phoneRegex.test(window.navigator.userAgent);

    if (this.args.autofocus && !isMobile) {
      return element.focus();
    }

    this.autofocus = false;
  }

  @action
  addonClick(event) {
    if (this.args.onAddonClick) {
      this.args.onAddonClick();
    }

    event.target.parentElement.parentElement.parentElement.querySelector('input').focus();
  }
}
