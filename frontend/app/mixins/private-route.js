import Ember from 'ember';

export default Ember.Mixin.create({
  beforeModel(transition) {
    if (!this.get('session.currentUser')) {
      this.get('session').set('previousInvalidatedRoute', transition);
      this.transitionTo('login');
    }
  }
});
