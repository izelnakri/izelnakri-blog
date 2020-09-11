import axios from 'axios';
import RSVP from 'rsvp';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import ENV from 'frontend/config/environment';

export default class HttpService extends Service {
  @service session;

  // @ts-ignore
  get(url, headers) {
    return makeAxiosRequest('GET', {
      headers: this.buildHeaders(headers),
      url: buildUrl(url),
    });
  }
  post(url, data = {}, headers) {
    return makeAxiosRequest('POST', {
      headers: this.buildHeaders(headers),
      url: buildUrl(url),
      data: data,
    });
  }
  put(url, data = {}, headers) {
    return makeAxiosRequest('PUT', {
      headers: this.buildHeaders(headers),
      url: buildUrl(url),
      data: data,
    });
  }
  delete(url, headers) {
    return makeAxiosRequest('DELETE', {
      headers: this.buildHeaders(headers),
      url: buildUrl(url),
    });
  }
  buildHeaders(headers) {
    const authHeader = this.session.authenticationToken
      ? {
          Authorization: `Bearer ${this.session.authenticationToken}`,
        }
      : {};

    return Object.assign(authHeader, { 'Content-Type': 'application/json' }, headers);
  }
}

function buildUrl(url) {
  return url.startsWith('/') ? `${ENV.APP.API_HOST}${url}` : url;
}

function makeAxiosRequest(method, options) {
  return new RSVP.Promise((resolve, reject) => {
    return axios(Object.assign(options, { method: method }))
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
