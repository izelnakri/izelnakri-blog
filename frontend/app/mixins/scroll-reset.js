import Ember from 'ember';

const { Mixin, computed, inject } = Ember;

export default Mixin.create({
  fastboot: inject.service(),
  isFastBoot: computed.reads('fastboot.isFastBoot'),
  scrollToTop: true,

  beforeModel() {
    if (this.get('scrollToTop') && !this.get('isFastBoot')) {
      this._super(...arguments);
      window.scrollTo(0,0);
    }
  }
});
