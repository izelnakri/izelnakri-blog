// @ts-nocheck
import { inject as service } from '@ember/service';

export default function PrivateRoute(Class: Class) {
  return class PrivateRoutedClass extends Class {
    @service session;
    @service('flash-messages') flashMessages;

    beforeModel(transition) {
      if (!this.session.currentUser) {
        this.session.previousRouteTransition = transition;
        this.replaceWith('login');
        this.flashMessages.warning(
          this.loginRequiredFlashMessage || 'Please login to view this page'
        );
      }
    }
  };
}
