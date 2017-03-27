import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('public', { path: '/' }, function() {
    this.route('index', { path: '/' });
    this.route('blog-post', { path: '/:slug' });
  });

  this.route('admin', function() {
    this.route('index', { path: '/' });
    this.route('content');
    this.route('posts', function() {
      this.route('new');
      this.route('post', { path: '/:slug' });
    });
    this.route('settings');
  });

  this.route('login');
  this.route('logout');
});

export default Router;
