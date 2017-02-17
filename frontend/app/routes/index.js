import BaseRoute from 'frontend/routes/base';

export default BaseRoute.extend({
  redirect() {
    return this.get('store').query('blog-post', { filter: 'latest' }).then((latestPosts) => {
      return this.transitionTo('public.blog-post', latestPosts.get('lastObject.slug'));
    });
  }
});
