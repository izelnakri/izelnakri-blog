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

      this.get('model').save().then((model) => {
        return this.get('onSuccess') ? this.get('onSuccess')(model) : undefined;
      }).catch((error) => {
        this.get('flash').danger('An error occured when sending the form');
        console.log('Error occured:\n', error);
        return this.get('onError') ? this.get('onError')(model) : undefined;
      }).finally(() => {
        console.log('Finally called');
        this.set('isLoading', false);
        return this.get('onSubmit') ? this.get('onSubmit')(model) : undefined;
      });

      return false;
    }

    return this.get('onSubmit')();
  }
});
