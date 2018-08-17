import AdminRoute from 'frontend/src/ui/routes/admin/route';

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
