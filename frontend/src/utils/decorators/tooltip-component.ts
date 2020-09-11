// import Mixin from '@ember/object/mixin';

// export default Mixin.create({
//   tooltip: false,
//   tooltipAnimation: true,
//   tooltipContainer: false,
//   tooltipPlacement: 'bottom',
//   tooltipSelector: false,
//   tooltipTrigger: 'hover focus',
//   didInsertElement() {
//     this._super(...arguments);

//     if (this.tooltip) {
//       $(this.element).tooltip({
//         animation: this.tooltipAnimation,
//         container: this.tooltipContainer,
//         placement: this.tooltipPlacement, // implement for button
//         trigger: this.tooltipTrigger,
//         title: String(this.tooltip),
//         selector: this.tooltipSelector
//       });
//     }
//   },
//   click() {
//     $(this.element)
//       .find(this.tooltipSelector)
//       .tooltip('hide');
//   }
// });
