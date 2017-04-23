import Ember from 'ember';

const { Component, inject } = Ember;

export default Component.extend({
  modals: inject.service(),
  classNameBindings: ['modalName'],
  init() {
    this._super(...arguments);
  },
  actions: {
    cancel() {
      this.get('modals.promise').reject();
      this.get('modals').close();
    },
    confirm() {
      this.get('modals.promise').resolve();
      this.get('modals').close();
    }
  }
});
