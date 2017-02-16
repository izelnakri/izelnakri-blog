import config from 'frontend/config/environment';
import Ember from 'ember';
import DS from 'ember-data';

const { inject, computed } = Ember;
const { dasherize, pluralize } = Ember.String;

export default DS.RESTAdapter.extend({
  host: config.apiHost,
  session: inject.service(),
  pathForType: function(type) {
    return pluralize(dasherize(type));
  },
  headers: computed('session.authenticationToken', function() {
    if (this.get('session.authenticationToken')) {
      return { 'Authorization': `Bearer ${this.get('session.authenticationToken')}` };
    }
  }),
  coalesceFindRequests: true
});
