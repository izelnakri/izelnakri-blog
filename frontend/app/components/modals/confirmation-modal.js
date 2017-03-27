import Ember from 'ember';

export default Ember.Component.extend({
  modals: Ember.inject.service(),
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
