import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  session: service(),
  flashMessages: service('flash-messages'),

  beforeModel(transition) {
    if (!this.session.currentUser) {
      this.session.set('previousRouteTransition', transition);
      this.replaceWith('login');
      this.flashMessages.warning('Please login to view this page');
    }
  }
});
