import BaseRoute from 'frontend/src/ui/routes/base';
import RSVP from 'rsvp';

export default BaseRoute.extend({
  model(params) {
    return RSVP.hash({
      blogPost: this.store.queryRecord('blog-post', { slug: params.slug })
    });
  }
});
