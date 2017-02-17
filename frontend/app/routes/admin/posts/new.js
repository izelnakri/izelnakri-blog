import AdminRoute from 'frontend/routes/admin';

export default AdminRoute.extend({
  model() {
    return {
      domain: document.location.origin,
      blogPost: this.get('store').createRecord('blog-post', {
        user: this.get('session.currentUser')
      })
    };
  }
});
