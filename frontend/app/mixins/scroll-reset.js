import Ember from 'ember';

export default Ember.Mixin.create({
  fastboot: Ember.inject.service(),
  isFastBoot: Ember.computed.reads('fastboot.isFastBoot'),
  scrollToTop: true,

  beforeModel: function() {
    if (this.get('scrollToTop') && !this.get('isFastBoot')) {
      this._super(...arguments);
      window.scrollTo(0,0);
    }
  }
});
