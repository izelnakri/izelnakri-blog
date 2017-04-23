import Ember from 'ember';
import TooltipMixin from 'frontend/mixins/tooltip';

const { Component, computed } = Ember;

const InIcon = Component.extend(TooltipMixin, {
  tagName: 'i',
  classNames: ['fa', 'in-icon'],
  classNameBindings: [
    'iconCssClass', 'fixedWidth:fa-fw', 'circle:fa-round', 'sizeClass', 'spinClass'
  ],
  fixedWidth: false,
  size: null,
  spin: false,
  iconCssClass: computed('icon', function() {
    return this.get('icon') ? `fa-${this.get('icon')}` : null;
  }),
  sizeClass: computed('size', function() {
    return this.get('size') ? `fa-${this.get('size')}` : null;
  }),
  spinClass: computed('spin', function() {
    return this.get('spin') ? 'fa-spin' : null;
  }),
});

InIcon.reopenClass({
  positionalParams: ['icon']
});

export default InIcon;
