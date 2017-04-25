import Ember from 'ember';
import BaseRoute from 'frontend/routes/base';

const { RSVP } = Ember;

export default BaseRoute.extend({
  model(params) {
    return RSVP.hash({
      blogPost: this.get('store').queryRecord('blog-post', { slug: params.slug })
    });
  }
});
