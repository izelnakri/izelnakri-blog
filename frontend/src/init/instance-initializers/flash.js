export function initialize(app) {
  app.inject('controller', 'flash', 'service:flash-messages');
  app.inject('component', 'flash', 'service:flash-messages');
  app.inject('route', 'flash', 'service:flash-messages');

  window.require('frontend/initializers/flash-messages').default.initialize(app);
}

export default {
  initialize
};
