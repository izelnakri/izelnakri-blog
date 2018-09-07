import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import ENV from '../config/environment';

Number.prototype.times = function(func) {
  return Array.from({ length: this }).map((_, index) => func(index + 1));
};

Object.filter = (object, arrayOfKeys) => {
  return Object.keys(object).reduce((newObject, key) => {
    return arrayOfKeys.includes(key) ? newObject : Object.assign(newObject, { [key]: object[key] });
  }, {});
};

Object.take = (object, arrayOfKeys) => {
  return Object.keys(object).reduce((newObject, key) => {
    return arrayOfKeys.includes(key) ? Object.assign(newObject, { [key]: object[key] }) : newObject;
  }, {});
};

const App = Application.extend({
  modulePrefix: ENV.modulePrefix,
  podModulePrefix: ENV.podModulePrefix,
  Resolver
});

loadInitializers(App, `${ENV.modulePrefix}/src/init`);
loadInitializers(App, ENV.modulePrefix);

export default App;
