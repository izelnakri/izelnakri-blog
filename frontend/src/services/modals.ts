import Service from '@ember/service';
import { A } from '@ember/array';
import { defer } from 'rsvp';

interface ModalPromise {
  [propName: string]: any;
}

export default class ModalService extends Service {
  model = A();
  promises = A();

  open(name, model, context = {}) {
    this.openWithoutPromise(name, model, context);
    this.promises.pushObject(defer());

    return (this.promises.lastObject as ModalPromise).promise ;
  }

  openWithoutPromise(name, model, context = {}) {
    this.model.pushObject({
      name: name,
      componentName: `modal/${name}`,
      model: model,
      context: context
    });

    return this.promises;
  }

  resolve() {
    const targetPromise = this.promises.lastObject as ModalPromise;

    this.model.popObject();
    this.promises.popObject();

    return targetPromise ? targetPromise.resolve() : null;
  }

  close() {
    const targetPromise = this.promises.lastObject as ModalPromise;

    this.model.popObject();
    this.promises.popObject();

    return targetPromise ? targetPromise.reject() : null;
  }
}
