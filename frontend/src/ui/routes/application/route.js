import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  flashMessages: service('flash-messages'),
  session: service(),

  model() {
    return RSVP.hash({
      user: this.session.fetchCurrentUser()
    }).catch((error) => {
      console.log('hash error');
      console.log(error);
    });
  },
  actions: {
    login(model) {
      const email = model.get('primaryEmail.address');

      this.get('session').loginWithPassword(email, model.get('password')).then(() => {
        const previousTransition = this.get('session.previousInvalidatedRoute');

        if (previousTransition) {
          this.get('session').set('previousTransition', null);
          return previousTransition.retry();
        }

        this.transitionTo('admin');
      });
    },
    logout() {
      if (this.session.currentUser) {
        this.flashMessages.success('You have been logged out.');
        this.session.logout();
        this.transitionTo('public');
      }
    }
  }
});
