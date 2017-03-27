import BaseRoute from 'frontend/routes/base';

export default BaseRoute.extend({
  model(params) {
    return {
      blogPost: this.get('store').queryRecord('blog-post', { slug: params.slug })
    };
  }
});
