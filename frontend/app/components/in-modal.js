import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  classNames: ['modal'],
  attributeBindings: ['tabindex'],
  tabindex: "-1",
  header: true,
  sidebar: false,

  dialogClassNames: computed('size', 'sidebar', function() {
    var classNames = [];

    switch (this.get('size')) {
      case 'lg':
        classNames.push('modal-lg');
        break;
      case 'sm':
        classNames.push('modal-sm');
        break;
    }

    if (this.get('sidebar')) {
      classNames.push('modal-with-sidebar');
    }

    return classNames.join(' ');
  }),

  didInsertElement() {
    this.$().modal();

    this.$().modal().on('show.bs.modal', () => {
      return this.get('onShow') ? this.get('onShow')() : null;
    });
    this.$().modal().on('hide.bs.modal', () => {
      return this.get('onClose') ? this.get('onClose')() : null;
    });
  },
  willDestroyElement() {
    this.$().modal().off('hide.bs.modal');
    this.$().modal('hide');
  }
});
