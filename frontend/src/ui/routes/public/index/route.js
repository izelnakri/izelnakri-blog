import BaseRoute from 'frontend/src/ui/routes/base';

export default BaseRoute.extend({
  redirect() {
    return this.store.query('blog-post', { filter: 'latest' }).then((latestPosts) => {
      if (latestPosts.length) {
        return this.transitionTo('public.blog-post', latestPosts.get('lastObject.slug'));
      }
    });
  }
});
