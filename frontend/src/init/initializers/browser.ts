export default {
  name: 'browser',

  initialize(app) {
    app.inject('route', 'browser', 'service:browser');
    app.inject('controller', 'browser', 'service:browser');
    app.inject('component', 'browser', 'service:browser');
  },
};
