import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service flashMessages;
  @service session;

  model() {
    return RSVP.hash({
      user: this.session.fetchCurrentUser(),
    }).catch((error) => {
      console.log('hash error');
      console.log(error);
    });
  }
}
