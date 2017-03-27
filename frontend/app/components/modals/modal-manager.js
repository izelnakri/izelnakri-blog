import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['modal-manager'],

  actions: {
    close() {
      this.get('modals').close();
    }
  }
});
