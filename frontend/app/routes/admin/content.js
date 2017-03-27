import AdminRoute from 'frontend/routes/admin';

export default AdminRoute.extend({
  model() {
    return {
      blogPosts: this.get('store').query('blog-post', { filter: 'latest' }),
      currentUser: this.get('session.currentUser')
    };
  }
});
