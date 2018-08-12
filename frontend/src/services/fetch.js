import RSVP from 'rsvp';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import ENV from 'frontend/config/environment';

export default Service.extend({
  session: service(),

  fetch(url, headers) {
    return new RSVP.Promise((resolve, reject) => {
      return fetch(buildUrl(url), {
        method: 'GET', mode: 'no-cors', headers: this.buildHeaders(headers)
      }).then((response) => prepareResponsesFor(200, response, resolve, reject));
    });
  },
  post(url, data, headers) {
    return new RSVP.Promise((resolve, reject) => {
      return fetch(buildUrl(url), {
        method: 'POST', mode: 'no-cors', headers: this.buildHeaders(headers),
        body: JSON.stringify(data)
      }).then((response) => prepareResponsesFor(201, response, resolve, reject));
    });
  },
  put(url, data, headers) {
    return new RSVP.Promise((resolve, reject) => {
      return fetch(buildUrl(url), {
        method: 'PUT', mode: 'no-cors', headers: this.buildHeaders(headers),
        body: JSON.stringify(data)
      }).then((response) => prepareResponsesFor(200, response, resolve, reject));
    });
  },
  delete(url, headers) {
    return new RSVP.Promise((resolve, reject) => {
      return fetch(buildUrl(url), {
        method: 'DELETE', mode: 'no-cors', headers: this.buildHeaders(headers)
      }).then((response) => prepareResponsesFor(204, response, resolve, reject));
    });
  },
  buildHeaders(headers) {
    const authHeader = this.session.authenticationToken ? {
      'Authorization': `Bearer ${this.session.authenticationToken}`
    } : {};

    return Object.assign({}, authHeader, { 'Content-Type': 'application/json' }, headers);
  }
});

function prepareResponsesFor(statusCode, response, resolve, reject) {
  return response.json().then((json) => {
    return response.status === statusCode ? resolve(json, response) : reject([json, response]);
  });
}

function buildUrl(url) {
  return url.startsWith('/') ? `${ENV.APP.API_HOST}${url}` : url;
}
