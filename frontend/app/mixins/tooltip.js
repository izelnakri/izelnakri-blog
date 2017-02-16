import Ember from 'ember';

export default Ember.Mixin.create({
  tooltip: null,
  tooltipTrigger: 'hover',
  tooltipSelector: undefined,
  tooltipContainer: undefined,
  tooltipPlacement: 'bottom',
  tooltipAnimation: true,

  didInsertElement() {
    this._super(...arguments);

    if (this.get('tooltip')) {
      this.$().tooltip({
        trigger: this.get('tooltipTrigger'),
        title: String(this.get('tooltip')),
        selector: this.get('tooltipSelector'),
        animation: this.get('tooltipAnimation'),
        placement: this.get('tooltipPlacement'),
        container: this.get('tooltipContainer')
      });
    }
  },
  click() {
    this.$(this.get('tooltipSelector')).tooltip('hide');
  }
});
