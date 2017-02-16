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
    if (this.get('icon')) {
      return `fa-${this.get('icon')}`;
    }
  }),
  sizeClass: computed('size', function() {
    if (this.get('size')) {
      return `fa-${this.get('size')}`;
    }
  }),
  spinClass: computed('spin', function() {
    if (this.get('spin')) {
      return 'fa-spin';
    }
  }),
});

InIcon.reopenClass({
  positionalParams: ['icon']
});

export default InIcon;
