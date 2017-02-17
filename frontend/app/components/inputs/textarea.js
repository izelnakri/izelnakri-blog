import Ember from 'ember';
import FormComponentMixin from 'frontend/mixins/form-component';

const { Component } = Ember;

export default Component.extend(FormComponentMixin, {
  keyUp(event) {
    this.get('model').set(`${this.get('attribute')}`, event.target.value);
  }
});
