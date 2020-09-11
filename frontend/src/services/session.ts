import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import { typeOf } from '@ember/utils';
import RSVP from 'rsvp';
import { tracked } from '@glimmer/tracking';

export default class SessionService extends Service {
  @tracked currentUser = null;

  authenticationToken: string = null;
  cache = null;

  @service browser;
  @service fastboot;
  @service store;
  @service i18n;
  @service flashMessages;
  @service http;

  previousRouteTransition = null;

  constructor() {
    super(...arguments);

    this.authenticationToken = (() => {
      // debugger;
      if (this.fastboot.isFastBoot) {
        console.log('TOKEA is');
        console.log(this.fastboot.request.cookies);
        return this.fastboot.request.cookies['in-token'];
      }

      return (
        window.Cookies.get('in-token') ||
        (window.localStorage ? window.localStorage.getItem('in-token') : null)
      );
    })();
    console.log(this.authenticationToken);
  }

  getUser(input) {
    if (typeOf(input) === 'instance') {
      return input;
    }
    // @ts-ignore
    this.store.pushPayload('user', JSON.parse(JSON.stringify(input, true)));

    return this.store.peekRecord('user', input.user.id);
  }

  setCurrentUser(user) {
    run(() => {
      this.currentUser = this.getUser(user);
      this.setToken(this.currentUser.authenticationToken);

      if (window.Raven) {
        window.Raven.setUserContext({ user_id: this.currentUser.id });
      }
    });

    return this.currentUser;
  }

  setToken(token) {
    run(() => {
      this.authenticationToken = token;

      if (!this.fastboot.isFastBoot) {
        localStorage.setItem('in-token', token);
        window.Cookies.set('in-token', token);
      }
    });
  }

  fetchCurrentUser() {
    return new RSVP.Promise((resolve, reject) => {
      const token = this.authenticationToken;
      // debugger;
      console.log('token is', token);

      if (!token) {
        return reject();
      }

      return this.http
        .get('/me')
        .then(({ data }) => resolve(this.setCurrentUser(data)))
        .catch((response) => reject(response));
    });
  }

  loginWithPassword(email, password) {
    return new RSVP.Promise((resolve, reject) => {
      if (!email || !password) {
        this.flashMessages.danger('Please fill your email and password to login');

        return reject();
      }

      return this.http
        .post('/login', {
          email: email,
          password: password,
          browser_uuid: this.browser.uuid,
        })
        .then(({ data }) => {
          const currentUser = this.setCurrentUser(data);

          this.flashMessages.success('Successful login, welcome back!');

          return resolve(currentUser);
        })
        .catch(({ response }) => {
          if (response.status === 401) {
            this.flashMessages.danger('Wrong email and password combination');

            return reject(response.data);
          }

          this.flashMessages.danger('Unexpected error occured, please try again!');

          return reject(response.data);
        });
    });
  }

  logout() {
    return new RSVP.Promise((resolve) => {
      run(() => {
        this.currentUser = null;
        this.authenticationToken = null;

        window.Cookies.remove('in-token');
        localStorage.removeItem('in-token');
        return resolve();
      });
    });
  }
}

// TODO: write tests for this service
// import Service from '@ember/service';
// import { inject as service } from '@ember/service';
// import EmberObject, { computed } from '@ember/object';
// import { run } from '@ember/runloop';
// import { typeOf } from '@ember/utils';
// import { Promise } from 'rsvp';
// import { getOwner } from '@ember/application';

// export default Service.extend({
//   fastboot: computed(function() {
//     return getOwner(this).lookup('service:fastboot') || EmberObject.create({}); // TODO: remove after mber upgrade
//   }),
//   store: service(),
//   i18n: service(),
//   flashMessages: service('flash-messages'),
//   fetch: service(),

//   currentUser: null,
//   previousRouteTransition: null,

//   authenticationToken: computed(function() {
//     if (this.fastboot.isFastBoot) {
//       return this.fastboot.request.cookies['in-token'];
//     }

//     return window.Cookies.get('in-token') || window.localStorage.getItem('in-token');
//   }),

//   getUser(input) {
//     if (typeOf(input) === 'instance') {
//       return input;
//     }

//     this.store.pushPayload('user', JSON.parse(JSON.stringify(input, true)));

//     return this.store.peekRecord('user', input.user.id);
//   },
//   setCurrentUser(user) {
//     run(() => {
//       this.set('currentUser', this.getUser(user));
//       this.setToken(this.currentUser.authenticationToken);

//       if (window.Raven) {
//         window.Raven.setUserContext({ user_id: this.currentUser.id });
//       }
//     });

//     return this.currentUser;
//   },
//   setToken(token) {
//     run(() => {
//       this.set('authenticationToken', token);

//       if (!this.fastboot.isFastBoot) {
//         localStorage.setItem('in-token', token);
//         window.Cookies.set('in-token', token);
//       }
//     });
//   },
//   fetchCurrentUser() {
//     return new Promise((resolve, reject) => {
//       const token = this.authenticationToken;

//       if (!token) {
//         return reject();
//       }

//       return this.fetch.fetch('/me')
//         .then((json) => resolve(this.setCurrentUser(json)))
//         .catch(([json]) => reject(json));
//     });
//   },
//   loginWithPassword(email, password) {
//     return new Promise((resolve, reject) => {
//       if (!email || !password) {
//         this.flashMessages.danger('Please fill your email and password to login');

//         return reject();
//       }

//       return this.fetch.post('/login', {
//         email: email, password: password
//       }).then((json) => {
//         const currentUser = this.setCurrentUser(json);

//         this.flashMessages.success('Successful login, welcome back!');

//         return resolve(currentUser);
//       }).catch(([json, response]) => {
//         if (response.status === 401) {
//           this.flashMessages.danger('Wrong email and password combination');

//           return reject(json);
//         }

//         this.flashMessages.danger('Unexpected error occured, please try again!');

//         return reject(json);
//       });
//     });
//   },
//   logout() {
//     return new Promise((resolve) => {
//       run(() => {
//         this.set('currentUser', null);
//         this.set('authenticationToken', null);

//         window.Cookies.remove('in-token');
//         localStorage.removeItem('in-token');

//         return resolve();
//       });
//     });
//   }
// });
