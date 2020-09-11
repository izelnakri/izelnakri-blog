import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service flashMessages;
  @service session;

  @action
  login(model) {
    const email = model.get('primaryEmail.address');

    this.session.loginWithPassword(email, model.password).then(() => {
      const previousTransition = this.session.previousInvalidatedRoute;

      if (previousTransition) {
        this.session.set('previousTransition', null);
        return previousTransition.retry();
      }

      this.transitionToRoute('admin');
    });
  }

  @action
  logout() {
    if (this.session.currentUser) {
      this.flashMessages.success('You have been logged out.');
      this.session.logout();
      this.transitionToRoute('public');
    }
  }
}
