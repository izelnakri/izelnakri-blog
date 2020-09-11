import BaseRoute from 'frontend/src/ui/routes/base';
import RSVP from 'rsvp';

export default class PublicBlogPostRoute extends BaseRoute {
  model(params) {
    return RSVP.hash({
      blogPost: this.store.queryRecord('blog-post', { slug: params.slug }),
    });
  }
}
