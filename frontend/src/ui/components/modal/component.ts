import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class Modal extends Component<{
  header?: boolean;
  size?: string;
  onShow?: () => {};
  onClose?: () => {};
}> {
  @service modals;

  get header() {
    return 'header' in this.args ? this.args.header : true;
  }

  get sizeClassName() {
    if (this.args.size === 'lg') {
      return 'modal-lg';
    } else if (this.args.size === 'sm') {
      return 'modal-sm';
    }

    return '';
  }

  @action
  registerEvents(element) {
    window
      .$(element)
      .modal()
      .on('shown.bs.modal', () => (this.args.onShow ? this.args.onShow() : null));
    window
      .$(element)
      .modal()
      .on('hide.bs.modal', () => (this.args.onClose ? this.args.onClose() : null));
  }

  @action
  deregisterEvents(element) {
    let $element = window.$(element);

    $element.modal().off('hide.bs.modal');
    $element.modal('hide');
    $element.remove();
    window.$('.modal-backdrop').remove();
  }

  @action
  close() {
    return this.modals.close();
  }
}
