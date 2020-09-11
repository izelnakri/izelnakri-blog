import Service from '@ember/service';
import ENV from 'frontend/config/environment';
import { getOwner } from '@ember/application';

export default class DevToolService extends Service {
  owner = getOwner(this);

  constructor() {
    super(...arguments);

    if (ENV.devTools && ENV.devTools.global) {
      window.devTools = this;

      const self = this;

      [
        'route',
        'controller',
        'model',
        'service',
        'router',
        'routes',
        'currentRouteName',
        'lookup',
      ].forEach((property) => {
        window[property] = function () {
          return self[property].apply(self, arguments);
        };
      });
    }
  }

  app(name = 'main') {
    return this.lookup(`application:${name}`);
  }

  route(param) {
    return this.lookup(`route:${param || this.currentRouteName()}`);
  }

  controller(param) {
    return this.lookup(`controller:${param || this.currentRouteName()}`);
  }

  model(name) {
    const controller = this.controller(name);

    return controller && controller.get('model');
  }

  service(name) {
    return this.lookup(`service:${name}`);
  }

  router() {
    return this.lookup('service:router');
  }

  routes() {
    return Object.keys(this.router()._router._routerMicrolib.recognizer.names);
  }

  currentRouteName() {
    return this.service('router').currentRouteName;
  }

  lookup(name) {
    return this.owner.lookup(name);
  }
}
