import RSVP from 'rsvp';
import AdminRoute from 'frontend/src/ui/routes/admin/route';

export default AdminRoute.extend({
  model(params) {
    return RSVP.hash({
      domain: document.location.origin,
      blogPost: this.get('store').queryRecord('blog-post', { slug: params.slug })
    });
  }
});
