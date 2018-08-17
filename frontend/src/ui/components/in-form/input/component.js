import Component from '@ember/component';
import { computed } from '@ember/object';
import { debounce } from '@ember/runloop';
import FormComponentMixin from 'frontend/src/utils/mixins/form-component';

export default Component.extend(FormComponentMixin, {
  classNames: ['form-group'],
  hint: null,
  required: false,
  addonLeft: null,
  addonRight: null,
  addonLeftIsIcon: computed('addonLeft', function() {
    return this.addonLeft && this.addonLeft.startsWith('fa-');
  }),
  addonRightIsIcon: computed('addonRight', function() {
    return this.addonRight && this.addonRight.startsWith('fa-');
  }),
  addonLeftIcon: computed('addonLeftIsIcon', function() {
    return this.addonLeftIsIcon ? this.addonLeft.slice(3) : null;
  }),
  addonRightIcon: computed('addonRightIsIcon', function() {
    return this.addonRightIsIcon ? this.addonRight.slice(3) : null;
  }),
  inputGroup: computed.or('addonLeft', 'addonRight'),
  onAddonClick: null,
  onInput: () => {},
  keyUp() {
    this.model.set(`${this.attribute}`, this.$('input').val());
    debounce(this, 'onInput', 400);
  },
  change() {
    this.model.set(`${this.attribute}`, this.$('input').val());
    debounce(this, 'onInput', 400);
  },
  didInsertElement() {
    const phoneRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobile = phoneRegex.test(window.navigator.userAgent);

    if (this.autofocus && !isMobile) {
      return this.$('input').focus();
    }

    this.set('autofocus', false);
  },
  actions: {
    addonClick() {
      if (this.onAddonClick) {
        this.onAddonClick();
      }

      this.$().find('input').first().focus();
    }
  }
});
