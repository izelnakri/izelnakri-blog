import config from 'frontend/config/environment';
import Ember from 'ember';
import DS from 'ember-data';

const { inject, computed } = Ember;
const { dasherize, pluralize } = Ember.String;
const { RESTAdapter, InvalidError, errorsHashToArray } = DS;

export default RESTAdapter.extend({
  host: config.apiHost,
  session: inject.service(),
  pathForType: function(type) {
    return pluralize(dasherize(type));
  },
  headers: computed('session.authenticationToken', function() {
    if (this.get('session.authenticationToken')) {
      return { Authorization: `Bearer ${this.get('session.authenticationToken')}` };
    }
  }),
  coalesceFindRequests: true,
  handleResponse(status, headers, payload) {
    if (this.isInvalid(status, headers, payload)) {
      let errors = errorsHashToArray(payload.errors);

      return new InvalidError(errors);
    } else {
      return this._super(...arguments);
    }
  }
});
