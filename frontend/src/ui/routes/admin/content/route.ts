import RSVP from 'rsvp';
import Route from '@ember/routing/route';

export default class AdminContentRoute extends Route {
  model() {
    return RSVP.hash({
      lastBlogPosts: this.store.query('blog-post', { filter: 'latest' }),
    });
  }
}
