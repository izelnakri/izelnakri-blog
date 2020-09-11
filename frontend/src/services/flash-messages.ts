import Service from '@ember/service';
import ENV from 'frontend/config/environment';
import uuid from 'frontend/src/utils/uuid';
import { A } from '@ember/array';

interface FlashMessageOptions {
  sticky?: boolean;
  timeout?: number;
  onDestroy?: () => {};
}

export interface FlashObject {
  id: string;
  type: string;
  message: string;
  onDestroy?: (flashObject) => {};
  timeout: number;
  // maybe in future: priority, sticky, showProgress, extendedTimeout, destroyOnClick
}

export default class FlashService extends Service {
  preventDuplicates = ENV.flashMessageDefaults.preventDuplicates || false;
  sticky = ENV.flashMessageDefaults.sticky || false;
  timeout = ENV.flashMessageDefaults.timeout || 3000;
  queue = A();

  danger(message, options: FlashMessageOptions = {}) {
    return this.add('danger', message, options);
  }

  info(message, options: FlashMessageOptions = {}) {
    return this.add('info', message, options);
  }

  success(message, options: FlashMessageOptions = {}) {
    return this.add('success', message, options);
  }

  warning(message, options: FlashMessageOptions = {}) {
    return this.add('warning', message, options);
  }

  add(type, message, options: FlashMessageOptions = {}) {
    const id = uuid();
    const isSticky = options.sticky || this.sticky;
    const timeout = Number.isInteger(options.timeout) ? options.timeout : this.timeout;
    const onDestroy = options.onDestroy || function () {};
    const flashObject = { id, type, message, onDestroy, timeout };

    this.preventDuplicates ? this.clearMessages() : null;
    this.queue.pushObject(flashObject);

    if (!isSticky) {
      return window.setTimeout(() => this.clearFlashMessage(flashObject), timeout);
    }
  }

  clearFlashMessage(flashObject) {
    const targetObject = (this.queue as FlashObject[]).find(
      (object) => object.id === flashObject.id
    );

    if (targetObject) {
      this.queue.removeObject(targetObject);

      flashObject.onDestroy({
        id: targetObject.id,
        type: flashObject.type,
        message: flashObject.message,
        timeout: flashObject.timeout,
      });
    }
  }

  clearMessages() {
    return Promise.all(this.queue.map((flashObject) => this.clearFlashMessage(flashObject)));
  }
}
