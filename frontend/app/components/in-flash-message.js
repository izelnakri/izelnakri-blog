import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  classNames: ['alert', 'alert-dismissable', 'fade', 'show'],
  classNameBindings: ['alertClass'],
  attributeBindings: ['role'],
  alertClass: computed('flash.type', function() {
    return `alert-${this.get('flash.type')}`;
  }),
  role: 'alert'
});
