import Ember from 'ember';
import FormComponentMixin from 'frontend/mixins/form-component';

const { Component, computed } = Ember;

export default Component.extend(FormComponentMixin, {
  classNames: ['form-group'],
  addonLeft: null,
  addonRight: null,
  hint: null,
  required: false,
  inputGroup: computed('addonLeft', 'addonRight', function() {
    return this.get('addonLeft') || this.get('addonRight');
  }),
  placeholder: computed('type', function() {
    switch (this.get('type')) {
      case 'email':
        return 'name@email.com';
    }
  }),
  keyUp() {
    this.updateModelValue();
  },
  change() {
    this.updateModelValue();
  },
  updateModelValue() {
    const value = this.$('input').val();
    this.get('model').set(`${this.get('attribute')}`, value);
  },

  actions: {
    addonClick() {
      if (this.get('onAddonClick')) {
        this.get('onAddonClick')();
      }

      this.$().find('input').first().focus();
    }
  }
});
