/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  app.import('bower_components/moment/moment.js', { type: 'vendor' });
  app.import('bower_components/marked/lib/marked.js', { type: 'vendor' });

  if (!process.env.EMBER_CLI_FASTBOOT) {
    // TODO: Add selectize
    app.import('bower_components/raven-js/dist/raven.min.js', { type: 'vendor' });
    app.import('bower_components/raven-js/dist/plugins/ember.min.js', { type: 'vendor' });

    app.import('bower_components/tether/dist/js/tether.js', { type: 'vendor' });
    app.import('bower_components/bootstrap/dist/js/bootstrap.js', { type: 'vendor' });
    app.import('bower_components/prism/prism.js', { type: 'vendor' });
    app.import('bower_components/prism/components/prism-sql.min.js', { type: 'vendor' });
    app.import('bower_components/prism/components/prism-elixir.min.js', { type: 'vendor' });
    app.import('bower_components/selectize/dist/js/standalone/selectize.min.js', { type: 'vendor' });
  }

  return app.toTree();
};
