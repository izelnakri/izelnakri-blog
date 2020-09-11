import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | session', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:session');
    assert.ok(service);
  });
});

// import sinon from 'sinon';
// import { module, test } from 'qunit';
// import { run } from '@ember/runloop';
// import Response from 'memserver/response';
// import { IZEL, MORIS } from 'frontend/tests/constants';
// import SESSIONS from 'frontend/memserver/fixtures/sessions';
// import { setupTest } from 'frontend/tests/helpers';
// import Memserver from 'memserver/server';
// import initializer from 'frontend/memserver/initializer';
// import routes from 'frontend/memserver/routes';

// module('Unit | Service | Session', function(hooks) {
//   setupTest(hooks);

//   hooks.beforeEach(function() {
//     window.localStorage.removeItem('ml-token');
//     window.Cookies.remove('ml-token');
//     window.localStorage.removeItem('ml-sessions');
//     this.Server = new Memserver({ initializer, routes });
//   });

//   hooks.afterEach(function() {
//     window.localStorage.removeItem('ml-token');
//     window.localStorage.removeItem('ml-sessions');
//     window.Cookies.set('ml-token');
//     this.Server.shutdown();
//   });

//   test('it exists', function(assert) {
//     const service = this.owner.lookup('service:session');

//     assert.ok(service);
//   });

//   test('shouldnt have authenticationToken when there is no token in localStorage', function(assert) {
//     const service = this.owner.lookup('service:session');

//     assert.equal(service.authenticationToken, null);
//   });

//   test('should have authenticationToken when there is token in localStorage', function(assert) {
//     window.localStorage.setItem('ml-token', 'abc');

//     const service = this.owner.lookup('service:session');

//     assert.equal(service.authenticationToken, 'abc');
//   });

//   test('setCurrentUser sets and returns currentUser for different users', function(assert) {
//     assert.expect(11);

//     const service = this.owner.lookup('service:session');

//     assert.equal(service.currentUser, null);

//     const izelFromService = service.setCurrentUser({ user: IZEL });

//     assert.deepEqual(service.currentUser, izelFromService);
//     assert.equal(service.currentUser.id, IZEL.id);
//     assert.equal(service.currentUser.authenticationToken, IZEL.authentication_token);
//     assert.equal(Number(service.currentUser.person.id), IZEL.person_id);
//     assert.equal(window.localStorage.getItem('ml-token'), IZEL.authentication_token);

//     const morisFromService = service.setCurrentUser({ user: MORIS });

//     assert.deepEqual(service.currentUser, morisFromService);
//     assert.equal(service.currentUser.id, MORIS.id);
//     assert.equal(service.currentUser.authenticationToken, MORIS.authentication_token);
//     assert.equal(Number(service.currentUser.person.id), MORIS.person_id);
//     assert.equal(window.localStorage.getItem('ml-token'), MORIS.authentication_token);
//   });

//   test('logout works for different users', async function(assert) {
//     assert.expect(11);

//     const service = this.owner.lookup('service:session');
//     const store = this.owner.lookup('service:store');

//     assert.equal(service.currentUser, null);

//     run(() => {
//       service.setCurrentUser({ user: IZEL });

//       assert.equal(service.currentUser.authenticationToken, IZEL.authentication_token);

//       store.pushPayload({ session: IZEL.currentSession });
//       service.currentUser.currentSession = store.peekRecord('session', IZEL.currentSession.id);
//     });

//     await service.logout();

//     assert.equal(service.currentUser, null);
//     assert.equal(service.authenticationToken, null);
//     assert.equal(window.localStorage.getItem('ml-token'), null);
//     assert.ok(store.peekRecord('session', IZEL.currentSession.id).logoutAt, 'logoutAt set');

//     run(() => {
//       service.setCurrentUser({ user: MORIS });

//       assert.equal(service.currentUser.authenticationToken, MORIS.authentication_token);
//       store.pushPayload({ session: MORIS.currentSession });
//       service.currentUser.currentSession = store.peekRecord('session', MORIS.currentSession.id);
//     });

//     await service.logout();

//     assert.equal(service.currentUser, null);
//     assert.equal(service.authenticationToken, null);
//     assert.ok(store.peekRecord('session', MORIS.currentSession.id).logoutAt, 'logoutAt set');
//     assert.equal(window.localStorage.getItem('ml-token'), null);
//   });

//   test('updateSessionCache() works when user logs in with the same account', function(assert) {
//     const service = this.owner.lookup('service:session');
//     const store = this.owner.lookup('service:store');

//     run(() => {
//       service.setCurrentUser({ user: IZEL });
//       store.pushPayload({ session: IZEL.currentSession });
//       service.currentUser.currentSession = store.peekRecord('session', IZEL.currentSession.id);
//     });

//     service.updateSessionCache();

//     const expectedCache = Object.filter(IZEL.currentSession, ['mnemonic_phrase_ciphertext']);

//     assert.deepEqual(service.cache, [expectedCache]);
//     assert.deepEqual(JSON.parse(window.localStorage.getItem('ml-sessions')), [expectedCache]);

//     run(() => {
//       service.setCurrentUser({ user: IZEL });
//       store.pushPayload({ session: IZEL.currentSession });
//       service.currentUser.currentSession = store.peekRecord('session', IZEL.currentSession.id);
//     });

//     service.updateSessionCache();

//     assert.deepEqual(service.cache, [expectedCache]);
//     assert.deepEqual(JSON.parse(window.localStorage.getItem('ml-sessions')), [expectedCache]);
//   });

//   test('updateSessionCache() works when user logs in with different accounts', function(assert) {
//     const service = this.owner.lookup('service:session');
//     const store = this.owner.lookup('service:store');

//     run(() => {
//       service.setCurrentUser({ user: IZEL });
//       store.pushPayload({ session: IZEL.currentSession });
//       service.currentUser.currentSession = store.peekRecord('session', IZEL.currentSession.id);
//     });

//     service.updateSessionCache();

//     const izelCache = Object.filter(IZEL.currentSession, ['mnemonic_phrase_ciphertext']);

//     assert.deepEqual(service.cache, [izelCache]);
//     assert.deepEqual(JSON.parse(window.localStorage.getItem('ml-sessions')), [izelCache]);

//     run(() => {
//       service.setCurrentUser({ user: MORIS });
//       store.pushPayload({ session: MORIS.currentSession });
//       service.currentUser.currentSession = store.peekRecord('session', MORIS.currentSession.id);
//     });

//     service.updateSessionCache();

//     const morisCache = Object.filter(MORIS.currentSession, ['mnemonic_phrase_ciphertext']);

//     assert.deepEqual(service.cache, [izelCache, morisCache]);
//     assert.deepEqual(JSON.parse(window.localStorage.getItem('ml-sessions')), [
//       izelCache,
//       morisCache
//     ]);

//     const izelsLastSession = SESSIONS.filter((session) => session.user_id === IZEL.id)[1];

//     run(() => {
//       service.setCurrentUser({ user: IZEL });
//       store.pushPayload({ session: izelsLastSession });
//       service.currentUser.currentSession = store.peekRecord('session', izelsLastSession.id);
//     });

//     service.updateSessionCache();

//     const secondIzelCache = Object.filter(izelsLastSession, ['mnemonic_phrase_ciphertext']);

//     assert.deepEqual(service.cache, [izelCache, morisCache, secondIzelCache]);
//     assert.deepEqual(JSON.parse(window.localStorage.getItem('ml-sessions')), [
//       izelCache,
//       morisCache,
//       secondIzelCache
//     ]);
//   });

//   test('fetchCurrentUser() works', async function(assert) {
//     assert.expect(5);

//     const service = this.owner.lookup('service:session');

//     assert.equal(service.currentUser, null);

//     service.setCurrentUser({ user: IZEL });

//     assert.equal(service.currentUser.authenticationToken, IZEL.authentication_token);

//     const user = await service.fetchCurrentUser();

//     assert.equal(user.authenticationToken, IZEL.authentication_token);
//     assert.equal(service.currentUser.authenticationToken, IZEL.authentication_token);
//     assert.deepEqual(service.currentUser.getProperties(['id', 'username']), {
//       id: IZEL.id.toString(),
//       username: IZEL.username
//     });
//   });

//   test('fetchCurrentUser() rejects when there is a server error', function(assert) {
//     assert.expect(2);

//     const service = this.owner.lookup('service:session');

//     assert.equal(service.currentUser, null);

//     service.setCurrentUser({ user: IZEL });

//     this.Server.get('/me', () => {
//       return Response(401, { error: ['Not Authorized'] });
//     });

//     const done = assert.async();

//     service.fetchCurrentUser().catch((request) => {
//       assert.deepEqual(request.response.data, { error: ['Not Authorized'] });

//       done();
//     });
//   });

//   test('fetchCurrentUser() rejects when authenticationToken or ml-token isnt there', function(assert) {
//     assert.expect(1);
//     const service = this.owner.lookup('service:session');

//     let done = assert.async();
//     service.fetchCurrentUser().catch(() => {
//       assert.ok(true);

//       done();
//     });
//   });

//   test('fetchCurrentUser() works when there is authenticationToken', async function(assert) {
//     assert.expect(3);

//     let service = this.owner.lookup('service:session');

//     service.authenticationToken = IZEL.authentication_token;

//     assert.equal(service.currentUser, null);

//     const user = await service.fetchCurrentUser();

//     assert.equal(user.authenticationToken, IZEL.authentication_token);
//     assert.equal(service.currentUser.authenticationToken, IZEL.authentication_token);
//   });

//   test('fetchCurrentUser() works when there is ml-token', async function(assert) {
//     assert.expect(3);

//     window.localStorage.setItem('ml-token', IZEL.authentication_token);

//     const service = this.owner.lookup('service:session');

//     assert.equal(service.currentUser, null);

//     const user = await service.fetchCurrentUser();

//     assert.equal(user.authenticationToken, IZEL.authentication_token);
//     assert.equal(service.currentUser.authenticationToken, IZEL.authentication_token);
//   });

//   test('randomKeys work for diffent users', function(assert) {
//     window.localStorage.setItem('ml-sessions', JSON.stringify([SESSIONS[0]]));

//     const service = this.owner.lookup('service:session');
//     const store = this.owner.lookup('service:store');

//     assert.deepEqual(service.randomKeys, [SESSIONS[0].random_key]);

//     run(() => {
//       service.setCurrentUser({ user: MORIS });
//       store.pushPayload({ session: MORIS.currentSession });
//       service.currentUser.currentSession = store.peekRecord('session', MORIS.currentSession.id);
//       service.updateSessionCache();
//     });

//     assert.deepEqual(service.randomKeys, [SESSIONS[0].random_key, MORIS.currentSession.random_key]);
//   });

//   test('loginWithPassword(email, password) resolves with currentUser when match is correct', async function(assert) {
//     assert.expect(5);

//     const service = this.owner.lookup('service:session');
//     const flashMessages = this.owner.lookup('service:flash-messages');
//     const successFlashMessage = sinon.spy(flashMessages, 'success');
//     const result = await service.loginWithPassword(IZEL.primaryEmail.address, IZEL.password);

//     assert.ok(successFlashMessage.calledWith('Successful login, welcome back!'));
//     assert.equal(result.constructor.modelName, 'user');
//     assert.deepEqual(result, service.currentUser);
//     assert.equal(result.id, String(IZEL.id));
//     assert.equal(result.username, IZEL.username);
//   });

//   test('loginWithPassword() rejects when email, password was null or invalid match', function(assert) {
//     assert.expect(8);

//     const service = this.owner.lookup('service:session');
//     const flashMessages = this.owner.lookup('service:flash-messages');
//     const dangerFlashMessage = sinon.spy(flashMessages, 'danger');
//     const successFlashMessage = sinon.spy(flashMessages, 'success');

//     let done = assert.async();

//     service
//       .loginWithPassword()
//       .catch(() => {
//         assert.ok(dangerFlashMessage.calledWith('Please fill your email and password to login'));

//         return service.loginWithPassword(IZEL.primaryEmail.address);
//       })
//       .catch(() => {
//         assert.ok(dangerFlashMessage.calledWith('Please fill your email and password to login'));

//         return service.loginWithPassword(IZEL.primaryEmail.address, 'wrongpassword');
//       })
//       .catch(() => {
//         assert.ok(dangerFlashMessage.calledWith('Wrong email and password combination'));

//         return service.loginWithPassword(IZEL.primaryEmail.address, IZEL.password);
//       })
//       .then((result) => {
//         assert.ok(successFlashMessage.calledWith('Successful login, welcome back!'));
//         assert.equal(result.constructor.modelName, 'user');
//         assert.deepEqual(result, service.currentUser);
//         assert.equal(result.id, String(IZEL.id));
//         assert.equal(result.username, IZEL.username);

//         done();
//       });
//   });
// });
