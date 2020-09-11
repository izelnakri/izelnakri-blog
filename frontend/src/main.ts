import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import ENV from '../config/environment';

declare global {
  interface ObjectConstructor {
    take(target: any, ...sources: any): any;
    filter(target: any, ...sources: any): any;
  }

  interface Number {
    times(callback: any): any;
  }

  interface FreeObject {
    [propName: string]: any;
  }

  interface Element {
    value: any;
    style: any;
    focus: () => {};
    click: () => {};
  }

  interface Window {
    ga: any;
    Cookies: FreeObject;
    Raven: FreeObject;
    runningTests: any;
    luxon: any;
    vanillaTextMask: FreeObject;
    createAutoCorrectedDatePipe: FreeObject;
    blockies: FreeObject;
    Ember: any;
    DISABLE_MEMSERVER?: boolean;
    MemServer?: FreeObject;
    owner: any;
    devTools: any;
    $: any;
  }

  interface JQuery {
    modal(key?: string): JQuery;
  }
}

Number.prototype.times = function (func) {
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

export default class App extends Application {
  modulePrefix = ENV.modulePrefix;
  podModulePrefix = ENV.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, `${ENV.modulePrefix}/src/init`);
loadInitializers(App, ENV.modulePrefix);
