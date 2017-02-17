import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  classNames: ['in-blog-post'],
  content: computed('model', function() {
    return marked(this.get('model'));
  }),
  didInsertElement() {
    Prism.highlightAll();
  }
});
