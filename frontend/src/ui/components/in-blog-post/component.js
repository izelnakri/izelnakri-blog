import marked from 'marked';
// import Prism from 'prismjs';
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['in-blog-post'],
  content: computed('model.markdownContent', function() {
    if (this.get('model.markdownContent')) {
      return marked(this.get('model.markdownContent'));
    }
  }),
  didRender() {
    window.Prism.highlightAll();
  }
});
