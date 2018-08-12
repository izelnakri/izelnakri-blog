import Service from '@ember/service';
import { A } from '@ember/array';
import { defer } from 'rsvp';

export default Service.extend({
  model: A(),
  promise: A(),
  open(name, model, context={}) {
    this.close();

    this.openWithoutPromise(name, model, context);

    this.set('promise', new defer());

    return this.promise.promise;
  },
  openWithoutPromise(name, model, context={}) {
    this.close();

    this.model.pushObject({
      name: name,
      componentName: `ml-modal/${name}`,
      model: model,
      context: context
    });

    return this.promise.promise;
  },
  close() {
    this.model.shiftObject();
  }
});
