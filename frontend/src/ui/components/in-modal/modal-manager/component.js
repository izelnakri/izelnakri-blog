import Component from '@ember/component';

export default Component.extend({
  classNames: ['modal-manager'],

  actions: {
    close() {
      this.modals.close();
    }
  }
});
