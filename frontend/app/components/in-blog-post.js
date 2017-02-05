import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['in-blog-post'],
  didInsertElement() {
    Prism.highlightAll();
  }
});
