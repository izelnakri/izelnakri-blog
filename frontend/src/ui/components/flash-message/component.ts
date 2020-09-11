import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { FlashObject } from 'frontend/src/services/flash-messages'; // eslint-disable-line

export default class FlashMessage extends Component<{
  type?: string;
  flash: FlashObject;
  onDestroy?: () => {};
}> {
  @service flashMessages;

  closeButton = true;

  get onDestroy() {
    return (
      this.args.onDestroy ||
      function (flashOptions: FlashObject) {
        return flashOptions;
      }
    );
  }

  get type() {
    const typeFromArgument = this.args.type;
    const typeFromFlashArgument = this.args.flash ? this.args.flash.type : null;

    return typeFromArgument || typeFromFlashArgument || 'info';
  }

  @action
  clickCloseButton() {
    const lastFlashMessage = this.flashMessages.queue.lastObject as FlashObject;

    if (lastFlashMessage && lastFlashMessage.type === this.type) {
      const optionsToPass = Object.assign(
        {},
        { id: null, timeout: null },
        {
          type: this.type,
          message: lastFlashMessage.message,
        }
      );

      this.flashMessages.clearFlashMessage(lastFlashMessage);
      lastFlashMessage.onDestroy ? lastFlashMessage.onDestroy(optionsToPass) : null;

      return this.onDestroy(optionsToPass);
    }

    return this.onDestroy({ id: null, type: this.type, message: '', timeout: null });
  }
}
