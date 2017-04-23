// TODO: Raven log edge cases
import Ember from 'ember';
import config from '../config/environment';
import fetch from 'ember-network/fetch';

const { Service, inject, RSVP } = Ember;

export default Service.extend({
  store: inject.service(),
  flashMessages: inject.service(''),
  authenticationToken: null,
  currentUser: null,
  previousInvalidatedRoute: null,
  setCurrentUser(json) {
    this.get('store').pushPayload(json);
    this.set('currentUser', this.get('store').peekRecord('user', json.user.id));

    const currentUser = this.get('currentUser');

    if (Raven) {
      Raven.setUserContext({ user_id: currentUser.get('id') });
    }

    this.set('authenticationToken', currentUser.get('authenticationToken'));
    localStorage.setItem('inb_token', currentUser.get('authenticationToken'));
    return currentUser;
  },
  fetchCurrentUser() {
    return new RSVP.Promise((resolve, reject) => {
      if (!this.get('authenticationToken')) {
        return reject();
      }

      return fetch(`${config.apiHost}/me`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${this.get('authenticationToken')}`
        }
      }).then((response) => {
        if (response.status === 200) {
          return response.json();
        }

        return reject(); // not correct authenticationToken / authentication error
      }).then((json) => {
        const currentUser = this.setCurrentUser(json);

        return resolve(currentUser);
      }).catch(() => {
        return reject(); // network error
      });
    });
  },
  loginWithToken(authenticationToken) {
    return new RSVP.Promise((resolve, reject) => {
      this.set('authenticationToken', authenticationToken);

      this.fetchCurrentUser().then((user) => {
        localStorage.setItem('inb_token', authenticationToken);
        return resolve(user);
      }).catch(() => {
        return reject();
      });
    });
  },
  logout() {
    this.set('currentUser', null);
    localStorage.removeItem('inb_token');
    this.set('authenticationToken', null);
  },
  loginWithPassword(email, password) {
    return new RSVP.Promise((resolve, reject) => {
      if (!email || !password) {
        return reject();
      }

      return fetch(`${config.apiHost}/login`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
      }).then((response) => {
        if (response.status === 401) {
          this.get('flashMessages').danger('Wrong email and password combination');
          return reject();
        } else if (response.status === 200) {
          return response.json();
        }

        this.get('flashMessages').danger('Unexpected error occured, please try again!');
        return reject();
      }).then((json) => {
        if (json) {
          this.setCurrentUser(json);
          this.get('flashMessages').success('Login is successful, welcome back!');

          return resolve(this.get('currentUser'));
        }
      });
    });
  }
});
