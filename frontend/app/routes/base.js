import Ember from 'ember';
import ScrollResetMixin from 'frontend/mixins/scroll-reset';

const { Route } = Ember;

export default Route.extend(ScrollResetMixin, {
  headData: Ember.inject.service(),
  afterModel(model) {
    this.set(
      'headData.title',  this.get('i18n').t(`pages.${this.routeName}.title`, { model: model })
    );
    this.set(
      'headData.description', this.get('i18n').t(`pages.${this.routeName}.description`, {
        model: model
      })
    );
  },
  actions: {
    // loading: function(transition) {
    //   this.set('state.loading', true);
    //
    //   transition.finally(() => {
    //     this.set('state.loading', false);
    //   });
    // },
    logout() {
      this.get('session').logout().then(() => {
        this.transitionTo('public');
      }); // maybe a flashMessage
    }
  }
});
