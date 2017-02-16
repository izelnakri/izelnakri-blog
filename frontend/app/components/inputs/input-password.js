import Ember from 'ember';
import FormComponentMixin from 'frontend/mixins/form-component';

const { Component } = Ember;

export default Component.extend(FormComponentMixin, {
  classNames: ['form-group'],
  inputType: 'password',
  keyUp(event) {
    this.get('model').set(`${this.get('attribute')}`, event.target.value);
  },
  actions: {
    changeInputType() {
      if (this.get('inputType') === 'password') {
        return this.set('inputType', 'text');
      }

      this.set('inputType', 'password');
    },
    addonClick() {
      this.$().find('input').first().focus();
    }
  }
});
