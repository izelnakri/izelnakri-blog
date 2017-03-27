import Ember from 'ember';

const { Service, RSVP } = Ember;

export default Service.extend({
  model: Ember.A(),
  open(name, model) {
    this.get('model').pushObject({
      name: name,
      componentName: `modals/${name}`,
      model: model,
      context: {}
    });

    this.set('promise', new RSVP.defer());
    return this.get('promise.promise');
  },
  close() {
    this.get('model').shiftObject();
  }
});
