import Ember from 'ember';
const { Route } = Ember;

export default Route.extend({
  model() {
    let user = this.get('store').createRecord('user');
    user.get('emails').pushObject(this.get('store').createRecord('email'));
    return user;
  },
  redirect() {
    if (this.get('session.currentUser')) {
      this.transitionTo('public');
    }
  }
});
