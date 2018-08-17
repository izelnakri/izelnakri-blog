import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    if (window && window.localStorage) {
      this.get('session').set('authenticationToken', localStorage.getItem('inb_token'));

      return this.get('session').fetchCurrentUser().then(() => {}).catch(() => {});
    }
  },
  actions: {
    login(model) {
      const email = model.get('primaryEmail.address');

      debugger;
      this.get('session').loginWithPassword(email, model.get('password')).then(() => {
        const previousTransition = this.get('session.previousInvalidatedRoute');

        if (previousTransition) {
          this.get('session').set('previousTransition', null);
          return previousTransition.retry();
        }

        debugger;
        this.transitionTo('admin');
      });
    },
    logout() {
      if (this.get('currentUser')) {
        this.get('flashMessages').success('You have been logged out.');
        this.get('session').logout();
        this.transitionTo('public');
      }
    }
  }
});
