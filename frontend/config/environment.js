/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'frontend',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    i18n: { defaultLocale: 'en' },
    'ember-devtools': {
      global: true,
      enabled: environment === 'development'
    },
    flashMessageDefaults: { timeout: 5000 },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    fastboot: {
      hostWhitelist: ['izelnakri.com', /^localhost:\d+$/, '127.0.0.1:5005']
    }
  };

  if (environment === 'development') {
    // useMirage(ENV);
    useDevServer(ENV);

    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    useMirage(ENV);

    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.apiHost = 'https://izelnakri.com/api';
  }

  return ENV;
};


function useDevServer(ENV) {
  ENV.apiHost = 'http://localhost:4000';
  ENV['ember-cli-mirage'] = { enabled: false };
}

function useMirage(ENV) {
  ENV.apiHost = '';
  ENV['ember-cli-mirage'] = { enabled: true };
}
