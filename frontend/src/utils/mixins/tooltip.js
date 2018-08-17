import Mixin from '@ember/object/mixin';

export default Mixin.create({
  tooltip: null,
  tooltipTrigger: 'hover',
  tooltipSelector: undefined,
  tooltipContainer: undefined,
  tooltipPlacement: 'bottom',
  tooltipAnimation: true,
  didInsertElement() {
    this._super(...arguments);

    if (this.tooltip) {
      this.$().tooltip({
        trigger: this.tooltipTrigger,
        title: String(this.tooltip),
        selector: this.tooltipSelector,
        animation: this.tooltipAnimation,
        placement: this.tooltipPlacement,
        container: this.tooltipContainer
      });
    }
  },
  click() {
    this.$(this.tooltipSelector).tooltip('hide');
  }
});
