import Route from '@ember/routing/route';

export default class LoginRoute extends Route {
  model() {
    let user = this.store.createRecord('user');
    user.set('primaryEmail', this.store.createRecord('email'));

    return user;
  }
  redirect() {
    if (this.session.currentUser) {
      this.transitionTo('public');
    }
  }
}
