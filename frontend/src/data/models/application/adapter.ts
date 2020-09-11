import RESTAdapter from '@ember-data/adapter/rest';
import { InvalidError } from '@ember-data/adapter';
import { errorsHashToArray } from '@ember-data/adapter/error';
import { pluralize } from 'ember-inflector';
import { dasherize } from '@ember/string';
import { inject as service } from '@ember/service';
import ENV from 'frontend/config/environment';

export default class ApplicationAdapter extends RESTAdapter {
  @service session;

  host = ENV.APP.API_HOST;
  coalesceFindRequests = true;

  pathForType(type) {
    return pluralize(dasherize(type));
  }
  get headers() {
    if (this.session.authenticationToken) {
      return { Authorization: `Bearer ${this.session.authenticationToken}` };
    }

    return {};
  }
  handleResponse(status, headers, payload, requestData) {
    if (this.isInvalid(status, headers, payload)) {
      const errors = errorsHashToArray(payload.errors);

      return new InvalidError(errors);
    }

    return super.handleResponse(status, headers, payload, requestData);
  }
}
