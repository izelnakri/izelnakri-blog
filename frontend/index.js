import app from 'mber';

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

export default function (ENV) {
  const { environment } = ENV;

  app.import('node_modules/jquery/dist/jquery.min.js', {
    type: 'vendor',
    prepend: true,
  });

  app.importAddon('mber-head', { type: 'vendor' });

  app.importAsAMDModule('axios', 'node_modules/axios/dist/axios.min.js', {
    type: 'vendor'
  });

  app.import('vendor/cookie.js', { type: 'vendor' });
  app.import('node_modules/raven-js/dist/raven.min.js', {
    type: 'vendor',
    using: [{ transformation: 'fastbootShim' }],
  }); // NOTE: maybe make it a module
  app.import('node_modules/raven-js/dist/plugins/ember.min.js', {
    type: 'vendor',
    using: [{ transformation: 'fastbootShim' }],
  });

  app.import('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', {
    type: 'vendor',
    using: [{ transformation: 'fastbootShim' }],
  });

  app.importAddon('ember-i18n', 'mber-i18n', { type: 'vendor' });

  if (environment !== 'production') {
    app.importAsAMDModule('sinon', 'node_modules/sinon/pkg/sinon-no-sourcemaps.js', {
      type: 'test',
      prepend: true,
      transpile: false,
    });
    app.importAddon('ember-test-selectors');
    app.import('node_modules/ember-test-selectors/vendor/ember-test-selectors/patch-component.js');
  }

  app.importAsAMDModule('moment', 'node_modules/moment/min/moment.min.js', { type: 'vendor' });
  app.import('node_modules/luxon/build/global/luxon.js', { type: 'vendor' });
  app.import('vendor/shims/luxon.js', { type: 'vendor' });

  if (ENV.sentry && ENV.sentry.url) {
    app.injectInlineContent(
      'sentry',
      `
      <script>
        Raven.config('${ENV.sentry.url}', {
          ignoreUrls: [${ENV.sentry.ignoreUrls}],
          ignoreErrors: ${JSON.stringify(ENV.sentry.ignoreErrors)}
        }).addPlugin(Raven.Plugins.Ember).install();
      </script>
    `
    );
  }

  if (ENV.googleAnalyticsId) {
    app.injectInlineContent(
      'googleAnalytics',
      `
      <script>
        window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
        ga('create', '${ENV.googleAnalyticsId}', 'auto');
      </script>
      <script async src='https://www.google-analytics.com/analytics.js'></script>
    `
    );
  }

  app.importAsAMDModule('marked', 'node_modules/marked/lib/marked.js', {
    type: 'vendor',
    using: [{ transformation: 'fastbootShim' }],
  });
  app.import('node_modules/prismjs/prism.js', {
    type: 'vendor',
    using: [{ transformation: 'fastbootShim' }],
  });
  app.import('node_modules/prismjs/components/prism-sql.min.js', {
    type: 'vendor',
    using: [{ transformation: 'fastbootShim' }],
  });
  app.import('node_modules/prismjs/components/prism-elixir.min.js', {
    type: 'vendor',
    using: [{ transformation: 'fastbootShim' }],
  });
  app.import('node_modules/selectize/dist/js/standalone/selectize.min.js', {
    type: 'vendor',
    using: [{ transformation: 'fastbootShim' }],
  });

  return app.build(environment);
}
