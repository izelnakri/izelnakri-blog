import Component from '@ember/component';
import { computed } from '@ember/object';
// import TooltipMixin from 'frontend/src/utils/mixins/tooltip'; // TODO: investigate bootstrap tooltips

const MLNewIcon = Component.extend({
  tagName: 'i',
  classNames: ['fas', 'fa-icon'],
  classNameBindings: [
    'iconCssClass', 'fixedWidth:fa-fw', 'circle:fa-round', 'class', 'sizeClass', 'spinClass'
  ],
  class: '',
  fixedWidth: false,
  size: null,
  spin: false,
  iconCssClass: computed('icon', function() {
    return this.icon ? `fa-${this.icon}` : null;
  }),
  sizeClass: computed('size', function() {
    return this.size ? `fa-${this.size}` : null;
  }),
  spinClass: computed('spin', function() {
    return this.spin ? 'fa-spin' : null;
  }),
});

MLNewIcon.reopenClass({
  positionalParams: ['icon']
});

export default MLNewIcon;
