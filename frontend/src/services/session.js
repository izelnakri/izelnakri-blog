// TODO: write tests for this service
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';
import { typeOf } from '@ember/utils';
import { Promise } from 'rsvp';

export default Service.extend({
  fastboot: service(),
  store: service(),
  i18n: service(),
  flashMessages: service('flash-messages'),
  fetch: service(),

  currentUser: null,
  previousRouteTransition: null,

  authenticationToken: computed(function() {
    if (this.fastboot.isFastBoot) {
      return this.fastboot.request.cookies['in-token'];
    }

    return window.Cookies.get('in-token') || window.localStorage.getItem('in-token');
  }),

  getUser(input) {
    if (typeOf(input) === 'instance') {
      return input;
    }

    this.store.pushPayload('user', JSON.parse(JSON.stringify(input, true)));

    return this.store.peekRecord('user', input.user.id);
  },
  setCurrentUser(user) {
    run(() => {
      this.set('currentUser', this.getUser(user));
      this.setToken(this.currentUser.authenticationToken);

      if (window.Raven) {
        window.Raven.setUserContext({ user_id: this.currentUser.id });
      }
    });

    return this.currentUser;
  },
  setToken(token) {
    run(() => {
      this.set('authenticationToken', token);

      if (!this.fastboot.isFastBoot) {
        localStorage.setItem('in-token', token);
        // window.Cookies.set('in-token', token);
      }
    });
  },
  fetchCurrentUser() {
    return new Promise((resolve, reject) => {
      const token = this.authenticationToken;

      if (!token) {
        return reject();
      }

      return this.fetch.fetch('/me')
        .then((json) => resolve(this.setCurrentUser(json)))
        .catch(([json]) => reject(json));
    });
  },
  loginWithPassword(email, password) {
    return new Promise((resolve, reject) => {
      if (!email || !password) {
        this.flashMessages.danger('Please fill your email and password to login');

        return reject();
      }

      return this.fetch.post('/login', {
        email: email, password: password
      }).then((json) => {
        const currentUser = this.setCurrentUser(json);

        this.flashMessages.success('Successful login, welcome back!');

        return resolve(currentUser);
      }).catch(([json, response]) => {
        if (response.status === 401) {
          this.flashMessages.danger('Wrong email and password combination');

          return reject(json);
        }

        this.flashMessages.danger('Unexpected error occured, please try again!');

        return reject(json);
      });
    });
  },
  logout() {
    return new Promise((resolve) => {
      run(() => {
        this.set('currentUser', null);
        this.set('authenticationToken', null);

        window.Cookies.remove('in-token');
        localStorage.removeItem('in-token');

        return resolve();
      });
    });
  }
});
