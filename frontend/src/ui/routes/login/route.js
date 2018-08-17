import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    let user = this.get('store').createRecord('user');
    user.set('primaryEmail', this.get('store').createRecord('email'));

    return user;
  },
  redirect() {
    if (this.get('session.currentUser')) {
      this.transitionTo('public');
    }
  }
});
