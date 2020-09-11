export default {
  name: 'modal',

  initialize(app) {
    app.inject('application', 'modals', 'service:modals');
    app.inject('controller', 'modals', 'service:modals');
    app.inject('component', 'modals', 'service:modals');
    app.inject('route', 'modals', 'service:modals');
  },
};
