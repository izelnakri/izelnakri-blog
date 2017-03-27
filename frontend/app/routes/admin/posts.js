import AdminRoute from 'frontend/routes/admin';

export default AdminRoute.extend({
  actions: {
    visitBlogPost(slug) {
      this.transitionTo('public.blog-post', slug);
    },
    setPublishedAt(blogPost) {
      blogPost.set('publishedAt', moment().toDate());
    },
    unpublish(blogPost) {
      this.get('modals').open('confirmation-modal').then(() => {
        console.log('then called');
        blogPost.set('publishedAt', null);
        blogPost.save().then(() => {
          this.get('flashMessages').success(this.get('i18n').t('flash_messages.blog-post.unpublished'));
        }).catch((error) => {
          console.log('catch called');
          this.get('flashMessages').danger(this.get('i18n').t('flash_messages.save_error'));
          Raven.captureMessage(error);
        })
      });
    },
    deleteBlogPost(blogPost) {
      this.get('modals').open('confirmation-modal')
      // .then(() => {
      //   blogPost.destroyRecord().then(() => {
      //     this.get('flashMessages').t('flash_messages.blog-post.deleted');
      //     this.transitionTo('admin.content');
      //   }).catch((error) => {
      //     this.get('flashMessages').t('flash_messages.save_error');
      //     Raven.captureMessage(error);
      //   });
      // });
    },
    uploadBlogPostImage(){

    }
  }
});
