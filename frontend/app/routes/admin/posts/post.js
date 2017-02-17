import Ember from 'ember';
import AdminRoute from 'frontend/routes/admin';

const { RSVP } = Ember;

export default AdminRoute.extend({
  model(params) {
    return RSVP.hash({
      domain: document.location.origin,
      blogPost: this.get('store').queryRecord('blog-post', { slug: params.slug })
    });
  }
});
