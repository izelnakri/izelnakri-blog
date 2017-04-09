import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
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
  }
});
