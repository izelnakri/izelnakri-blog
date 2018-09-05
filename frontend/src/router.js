import EmberRouter from '@ember/routing/router';
import DocumentationRouter from 'mber-documentation';
import ENV from '../config/environment';

const Router = EmberRouter.extend({
  location: ENV.locationType,
  rootURL: ENV.rootURL
});

Router.map(function() {
  this.route('public', { path: '/' }, function() {
    this.route('index', { path: '/' });
    this.route('blog-post', { path: '/:slug' });
  });

  this.route('admin', function() {
    this.route('index', { path: '/' });
    this.route('content');

    this.route('posts', { resetNamespace: true }, function() {
      this.route('new');
      this.route('post', { path: '/:slug' });
    });

    this.route('lol', function() {
      this.route('abc');
    })

    this.route('settings');
  });

  this.route('login');
  this.route('logout');


  if (ENV.documentation && ENV.documentation.enabled) {
    DocumentationRouter.apply(this, [ENV]);
  }
});

export default Router;


// docsRoute
