// import SESSIONS from 'frontend/memserver/fixtures/sessions';
const LocalStorage = window.localStorage;

export default {
  login(user) {
    LocalStorage.setItem('in-token', user.authentication_token);
    window.Cookies.set('in-token', user.authentication_token);

    return user;
  },
  logout(owner) {
    let sessionService = owner.lookup('service:session');

    sessionService.authenticationToken = null;
    sessionService.currentUser = null;

    LocalStorage.removeItem('in-token');
    window.Cookies.remove('in-token');
  },
};
