/* eslint-env node */
const app = require('mber');

module.exports = function(ENV) {
  const { environment } = ENV;

  app.import('node_modules/jquery/dist/jquery.min.js', {
    type: 'vendor', prepend: true
  });

  app.importAddon('mber-head', { type: 'vendor' });

  // app.import('node_modules/fastclick/lib/fastclick.js', { type: 'vendor', using: [{ transformation: 'fastbootShim' }] });

  app.import('node_modules/raven-js/dist/raven.min.js', { type: 'vendor' }); // NOTE: maybe make it a module
  app.import('node_modules/raven-js/dist/plugins/ember.min.js', { type: 'vendor' });

  app.import('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', { type: 'vendor', using: [{ transformation: 'fastbootShim' }] });

  if (environment !== 'production') {
    app.importAddon('ember-devtools', { type: 'vendor' });
  }

  app.importAddon('ember-i18n', 'mber-i18n', { type: 'vendor' });
  app.importAddon('ember-cli-flash', { type: 'vendor' });
  app.importAddon('ember-route-action-helper', { type: 'vendor' });

  if (environment !== 'production') {
    app.importAsAMDModule('sinon', 'node_modules/sinon/pkg/sinon-no-sourcemaps.js', { type: 'vendor', transpile: false });
    app.importAddon('ember-test-selectors');
    app.import('node_modules/ember-test-selectors/vendor/ember-test-selectors/patch-component.js', { type: 'vendor' });
  }

  app.importAsAMDModule('moment', 'node_modules/moment/min/moment.min.js', { type: 'vendor' });

  if (ENV.sentry.url) {
    app.injectInlineContent('sentry', `
      <script>
        Raven.config('${ENV.sentry.url}', {
          ignoreUrls: [${ENV.sentry.ignoreUrls}],
          ignoreErrors: ${JSON.stringify(ENV.sentry.ignoreErrors)}
        }).addPlugin(Raven.Plugins.Ember).install();
      </script>
    `);
  }

  if (ENV.googleAnalyticsId) {
    app.injectInlineContent('googleAnalytics', `
      <script>
        window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
        ga('create', '${ENV.googleAnalyticsId}', 'auto');
      </script>
      <script async src='https://www.google-analytics.com/analytics.js'></script>
    `);
  }

  // app.import('bower_components/marked/lib/marked.js', { type: 'vendor' });
  // app.import('bower_components/prism/prism.js', { type: 'vendor' });
  // app.import('bower_components/prism/components/prism-sql.min.js', { type: 'vendor' });
  // app.import('bower_components/prism/components/prism-elixir.min.js', { type: 'vendor' });
  // app.import('bower_components/selectize/dist/js/standalone/selectize.min.js', { type: 'vendor' });

  return app.build(environment);
}
