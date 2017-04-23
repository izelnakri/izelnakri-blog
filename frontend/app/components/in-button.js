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
    return this.get('circle') ? `btn-circle` : null;
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
    this._super(...arguments);
    event.preventDefault();

    if (this.get('bubbles') === false) {
      event.stopPropagation();
    }

    this.sendAction('onClick');

    if (this.get('type') === 'submit') {
      this.get('form').submit(event);
    }
  }
});

InButton.reopenClass({
  positionalParams: ['style']
});

export default InButton;
