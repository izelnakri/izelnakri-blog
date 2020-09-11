import AdminRoute from 'frontend/src/ui/routes/admin/route';
import RSVP from 'rsvp';

export default class PostsPostRoute extends AdminRoute {
  model(params) {
    return RSVP.hash({
      domain: document.location.origin,
      blogPost: this.store.queryRecord('blog-post', { slug: params.slug }),
    });
  }
}
