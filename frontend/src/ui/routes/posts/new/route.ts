import AdminRoute from 'frontend/src/ui/routes/admin/route';

export default class PostsNewRoute extends AdminRoute {
  model() {
    return {
      domain: document.location.origin,
      blogPost: this.store.createRecord('blog-post', {
        user: this.session.currentUser,
      }),
    };
  }
}
