export default {
  name: 'flash-messages',

  initialize(app) {
    app.inject('application', 'flashMessages', 'service:flash-messages');
  },
};
