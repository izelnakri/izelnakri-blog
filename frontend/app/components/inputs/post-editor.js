import Ember from 'ember';
import FormComponentMixin from 'frontend/mixins/form-component';

const { Component } = Ember;

export default Component.extend(FormComponentMixin, {
  classNames: ['in-post-editor'],
  keyUp(event) {
    this.get('model').set(`${this.get('attribute')}`, event.target.value);
  }
});
