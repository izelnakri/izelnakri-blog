import BaseRoute from 'frontend/routes/base';

export default BaseRoute.extend({
  redirect() {
    return this.get('store').query('blog-post', { filter: 'latest' }).then((latestPosts) => {
      if (latestPosts.get('length')) {
        return this.transitionTo('public.blog-post', latestPosts.get('lastObject.slug'));
      }
    });
  }
});
