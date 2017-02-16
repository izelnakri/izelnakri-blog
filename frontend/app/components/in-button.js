import Ember from 'ember';
import TooltipMixin from 'frontend/mixins/tooltip';

const { Component, computed } = Ember;

const InButton = Component.extend(TooltipMixin, {
  tagName: 'button',
  classNames: ['btn'],
  classNameBindings: ['styleClass', 'sizeClass', 'loading:disabled', 'circleClass', 'blockClass'],
  attributeBindings: ['type:type', 'disabled', 'data-dismiss'],
  style: 'primary',
  block: false,
  circle: false,
  outline: false,
  muted: false,
  disabled: false,
  bubbles: true,
  type: 'button',
  circleClass: computed('circle', function() {
    if (this.get('circle')) {
      return `btn-circle`;
    }
  }),
  blockClass: computed('block', function() {
    return this.get('block') ? 'btn-block' : null;
  }),
  styleClass: computed('style', 'outline', 'muted', function() {
    var style = this.get('style');

    if (this.get('muted')) {
      return `btn-${style}-muted`;
    } else if (this.get('outline')) {
      return `btn-outline-${style}`;
    } else {
      return `btn-${style}`;
    }
  }),
  sizeClass: computed('size', function() {
    switch (this.get('size')) {
      case 'xs': return 'btn-xs';
      case 'sm': return 'btn-sm';
      case 'lg': return 'btn-lg';
    }
  }),
  click(event) {
    if (this.get('bubbles') === false) {
      event.stopPropagation();
    }

    this._super(...arguments);
    this.sendAction('onClick');
  }
});

InButton.reopenClass({
  positionalParams: ['style']
});

export default InButton;
