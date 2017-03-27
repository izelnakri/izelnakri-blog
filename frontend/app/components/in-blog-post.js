import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  classNames: ['in-blog-post'],
  content: computed('model.markdownContent', function() {
    if (this.get('model.markdownContent')) {
      return marked(this.get('model.markdownContent'));
    }
  }),
  didRender() {
    Prism.highlightAll();
  }
});
