import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  classNames: ['form-group'],
  errorMessage: computed('model.errors.@each', function() {
    if (this.get('model.errors')) {
      // debugger; in future for frontend validations
      var errors = this.get('model.errors').errorsFor(this.get('attribute'));

      if (errors[0]) {
        return errors[0].message;
      }
    }
  }),
  keyUp() {
    if (this.get('errorMessage')) {
      this.set('errorMessage', null);
    }
  }
});
