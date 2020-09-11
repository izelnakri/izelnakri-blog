import Component from '@glimmer/component';
// import TooltipMixin from 'frontend/src/utils/decorators/tooltip-component';

// @TooltipComponent
export default class FaIcon extends Component<{
  icon: string;
  size?: string;
  spin?: boolean;
}> {
  get iconCssClass() {
    return this.args.icon ? `fa-${this.args.icon}` : null;
  }

  get sizeClass() {
    return this.args.size ? `fa-${this.args.size}` : null;
  }

  get spinClass() {
    return this.args.spin ? 'fa-spin' : null;
  }
}
