import BaseRoute from 'frontend/routes/base';

export default BaseRoute.extend({
  redirect() {
    this.transitionTo('public.blog-post', 'application-wide-search-with-ecto-and-postgres');
  }
});
