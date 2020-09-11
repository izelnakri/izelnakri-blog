import moment from 'moment';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class PostsController extends Controller {
  @service modals;
  @service flashMessages;
  @service i18n;

  @action
  visitBlogPost(slug) {
    this.transitionToRoute('public.blog-post', slug);
  }

  @action
  setPublishedAt(blogPost) {
    blogPost.set('publishedAt', moment().toDate());
  }

  @action
  unpublish(blogPost) {
    this.modals.open('confirmation-modal').then(() => {
      console.log('then called');
      blogPost.set('publishedAt', null);
      blogPost
        .save()
        .then(() => {
          this.flashMessages.success(this.i18n.t('flash_messages.blog-post.unpublished'));
        })
        .catch((error) => {
          this.flashMessages.danger(this.i18n.t('flash_messages.save_error'));
          window.Raven.captureMessage(error);
        });
    });
  }
  // deleteBlogPost(blogPost) {
  //   this.get('modals').open('confirmation-modal')
  //   // .then(() => {
  //   //   blogPost.destroyRecord().then(() => {
  //   //     this.get('flashMessages').t('flash_messages.blog-post.deleted');
  //   //     this.transitionTo('admin.content');
  //   //   }).catch((error) => {
  //   //     this.get('flashMessages').t('flash_messages.save_error');
  //   //     Raven.captureMessage(error);
  //   //   });
  //   // });
  // },
  // uploadBlogPostImage(){

  // }
}
