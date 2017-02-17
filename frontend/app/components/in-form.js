import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',
  classNameBindings: [':in-form'],
  isLoading: false,
  submitHandler: true,
  submit(event) {
    event.preventDefault();
    if (this.get('submitHandler')) {
      const model = this.get('model');
      this.set('isLoading', true);

      return model.save().then((model) => {
        // translator
        this.get('flashMessages').success('Saved successfully');
        return this.get('onSuccess') ? this.get('onSuccess')(model) : undefined;
      }).catch((error) => {
        // translator
        this.get('flashMessages').danger('An error occured when sending the form');
        return this.get('onError') ? this.get('onError')(model) : undefined;
        // move error to Raven
      }).finally((a, b) => {
        this.set('isLoading', false);
        return this.get('onSubmit') ? this.get('onSubmit')(model) : undefined;
      });
    }

    return this.get('onSubmit')();
  }
});
