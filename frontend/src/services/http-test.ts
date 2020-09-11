// import Response from 'memserver/response';
import { module, test } from 'qunit';
// import ENV from 'frontend/config/environment';
import authentication from 'frontend/tests/helpers/authentication';
import { setupTest } from 'frontend/tests/helpers';
// import Memserver from "memserver/server";
// import initializer from "frontend/memserver/initializer";
// import routes from "frontend/memserver/routes";
// import { IZEL } from 'frontend/tests/constants'

module('Unit | Service | Http', function (hooks) {
  setupTest(hooks);

  hooks.afterEach(function () {
    if (this.Server) {
      this.Server.shutdown();
    }

    authentication.logout(this.owner);
  });

  test('it exists', function (assert) {
    let service = this.owner.lookup('service:http');
    assert.ok(service);
  });

  // test('http.get() works for a visitor', function(assert) {
  //   assert.expect(12);

  //   this.Server = new Memserver({ initializer, routes });

  //   let http = this.owner.lookup('service:http');
  //   let done = assert.async();

  //   this.Server.get('/testing-http', ({ headers, queryParams }) => {
  //     if (Object.keys(headers).length > 1) {
  //       assert.deepEqual(headers, {
  //         'Accept': 'application/json, text/plain, */*',
  //         'accept-language': 'nl'
  //       });
  //     } else {
  //       assert.deepEqual(headers, {
  //         'Accept': 'application/json, text/plain, */*'
  //       });
  //     }

  //     if (Object.keys(queryParams).length > 0) {
  //       assert.deepEqual(queryParams, { testing: true });

  //       return { testing: 'works' };
  //     }

  //     return { fetchMethod: 'works' };
  //   });

  //   http.get('/testing-http').then((response) => {
  //     assert.deepEqual(response.data, { fetchMethod: 'works' });

  //     return http.get('/testing-http?testing=true');
  //   }).then(({ data }) => {
  //     assert.deepEqual(data, { testing: 'works' });

  //     return http.get(`${ENV.APP.API_HOST}/testing-http`, { 'accept-language': 'nl' });
  //   }).then((response) => {
  //     assert.deepEqual(response.data, { fetchMethod: 'works' });
  //     assert.equal(response.request.headers['accept-language'], 'nl');

  //     return http.get(`${ENV.APP.API_HOST}/testing-http?testing=true`, {
  //       'accept-language': 'nl'
  //     });
  //   }).then((response) => {
  //     assert.deepEqual(response.data, { testing: 'works' });
  //     assert.equal(response.request.headers['accept-language'], 'nl');

  //     done();
  //   });
  // });

  // test('http.get() works for a loggedIn user', function(assert) {
  //   assert.expect(16);

  //   authentication.login(IZEL);

  //   this.Server = new Memserver({ initializer, routes });

  //   let http = this.owner.lookup('service:http');
  //   let done = assert.async();

  //   this.Server.get('/private-http', ({ headers, queryParams }) => {
  //     const token = `Bearer ${IZEL.authentication_token}`;

  //     assert.equal(headers.Authorization, token);

  //     if (headers.Authorization !== token) {
  //       return Response(401, { message: 'unauthorized' });
  //     }

  //     if (Object.keys(headers).length > 2) {
  //       assert.deepEqual(headers, {
  //         'Accept': 'application/json, text/plain, */*',
  //         'accept-language': 'nl',
  //         'Authorization': `Bearer ${IZEL.authentication_token}`
  //       });
  //     } else {
  //       assert.deepEqual(headers, {
  //         'Accept': 'application/json, text/plain, */*',
  //         'Authorization': `Bearer ${IZEL.authentication_token}`
  //       });
  //     }

  //     if (Object.keys(queryParams).length > 0) {
  //       assert.deepEqual(queryParams, { testing: true });

  //       return { testing: 'works' };
  //     }

  //     return { fetchMethod: 'works' };
  //   });

  //   http.get('/private-http').then((response) => {
  //     assert.deepEqual(response.data, { fetchMethod: 'works' });

  //     return http.get('/private-http?testing=true');
  //   }).then(({ data }) => {
  //     assert.deepEqual(data, { testing: 'works' });

  //     return http.get(`${ENV.APP.API_HOST}/private-http`, { 'accept-language': 'nl' });
  //   }).then((response) => {
  //     assert.deepEqual(response.data, { fetchMethod: 'works' });
  //     assert.equal(response.request.headers['accept-language'], 'nl');

  //     return http.get(`${ENV.APP.API_HOST}/private-http?testing=true`, {
  //       'accept-language': 'nl'
  //     });
  //   }).then((response) => {
  //     assert.deepEqual(response.data, { testing: 'works' });
  //     assert.equal(response.request.headers['accept-language'], 'nl');

  //     done();
  //   });
  // });

  // test('http.get() calls catch when there are errors', function(assert) {
  //   assert.expect(15);

  //   let http = this.owner.lookup('service:http');
  //   let done = assert.async();

  //   http.get('/private-http').catch((response) => {
  //     assert.equal(response.message, 'Network Error');

  //     this.Server = new Memserver({ initializer, routes });

  //     this.Server.get('/private-http', () => {
  //       return Response(500, { error: 'Unexpected error occured' });
  //     });

  //     return http.get('/private-http');
  //   }).catch((error) => {
  //     assert.equal(error.message, 'Request failed with status code 500');
  //     assert.equal(error.response.status, 500);
  //     assert.deepEqual(error.response.data, { error: 'Unexpected error occured' });

  //     this.Server.get('/private-http', () => {
  //       return Response(404, { error: { message: 'Not found' } });
  //     });

  //     return http.get(`${ENV.APP.API_HOST}/private-http`);
  //   }).catch((error) => {
  //     assert.equal(error.message, 'Request failed with status code 404');
  //     assert.equal(error.response.status, 404);
  //     assert.deepEqual(error.response.data, { error: { message: 'Not found' } });

  //     this.Server.get('/private-http', () => {
  //       return Response(422, { error: 'Unprocessable thing' });
  //     });

  //     return http.get(`${ENV.APP.API_HOST}/private-http`);
  //   }).catch((error) => {
  //     assert.equal(error.message, 'Request failed with status code 422');
  //     assert.equal(error.response.status, 422);
  //     assert.deepEqual(error.response.data, { error: 'Unprocessable thing' });

  //     this.Server.get('/private-http', () => {
  //       return Response(401, { error: 'unauthorized' });
  //     });

  //     return http.get('/private-http');
  //   }).catch((error) => {
  //     assert.equal(error.message, 'Request failed with status code 401');
  //     assert.equal(error.response.status, 401);
  //     assert.deepEqual(error.response.data, { error: 'unauthorized' });

  //     this.Server.get('/private-http', () => {
  //       return { user:  { name: 'it works' } };
  //     });

  //     return http.get('/private-http');
  //   }).then((response) => {
  //     assert.equal(response.status, 200);
  //     assert.deepEqual(response.data, { user:  { name: 'it works' } });

  //     done();
  //   });
  // });

  // test('http.post() works for a visitor', function(assert) {
  //   assert.expect(16);

  //   this.Server = new Memserver({ initializer, routes });

  //   let http = this.owner.lookup('service:http');
  //   let done = assert.async();

  //   this.Server.post('/testing-http', ({ params, headers, queryParams }) => {
  //     assert.deepEqual(params, { book: { title: 'Security Analysis' } });

  //     if (Object.keys(headers).length > 2) {
  //       assert.deepEqual(headers, {
  //         'Accept': 'application/json, text/plain, */*',
  //         'Content-Type': 'application/json',
  //         'accept-language': 'nl'
  //       });
  //     } else {
  //       assert.deepEqual(headers, {
  //         'Accept': 'application/json, text/plain, */*',
  //         'Content-Type': 'application/json'
  //       });
  //     }

  //     if (Object.keys(queryParams).length > 0) {
  //       assert.deepEqual(queryParams, { testing: true });

  //       return { testing: 'works' };
  //     }

  //     return { fetchMethod: 'works' };
  //   });

  //   const POST_PARAMS = { book: { title: 'Security Analysis' } };

  //   http.post('/testing-http', POST_PARAMS).then((response) => {
  //     assert.deepEqual(response.data, { fetchMethod: 'works' });

  //     return http.post('/testing-http?testing=true', POST_PARAMS);
  //   }).then(({ data }) => {
  //     assert.deepEqual(data, { testing: 'works' });

  //     return http.post(`${ENV.APP.API_HOST}/testing-http`, POST_PARAMS, { 'accept-language': 'nl' });
  //   }).then((response) => {
  //     assert.deepEqual(response.data, { fetchMethod: 'works' });
  //     assert.equal(response.request.headers['accept-language'], 'nl');

  //     return http.post(`${ENV.APP.API_HOST}/testing-http?testing=true`, POST_PARAMS, {
  //       'accept-language': 'nl'
  //     });
  //   }).then((response) => {
  //     assert.deepEqual(response.data, { testing: 'works' });
  //     assert.equal(response.request.headers['accept-language'], 'nl');

  //     done();
  //   });
  // });

  // test('http.post() works for a loggedin user', function(assert) {
  //   assert.expect(20);

  //   authentication.login(IZEL);
  //   this.Server = new Memserver({ initializer, routes });

  //   let http = this.owner.lookup('service:http');
  //   let done = assert.async();

  //   this.Server.post('/private-http', ({ params, headers, queryParams }) => {
  //     const token = `Bearer ${IZEL.authentication_token}`;

  //     assert.equal(headers.Authorization, token);
  //     assert.deepEqual(params, { book: { title: 'Security Analysis' } });

  //     if (headers.Authorization !== token) {
  //       return Response(401, { message: 'unauthorized' });
  //     }

  //     if (Object.keys(headers).length > 3) {
  //       assert.deepEqual(headers, {
  //         'Authorization': `Bearer ${IZEL.authentication_token}`,
  //         'Accept': 'application/json, text/plain, */*',
  //         'Content-Type': 'application/json',
  //         'accept-language': 'nl'
  //       });
  //     } else {
  //       assert.deepEqual(headers, {
  //         'Authorization': `Bearer ${IZEL.authentication_token}`,
  //         'Accept': 'application/json, text/plain, */*',
  //         'Content-Type': 'application/json'
  //       });
  //     }

  //     if (Object.keys(queryParams).length > 0) {
  //       assert.deepEqual(queryParams, { testing: true });

  //       return { testing: 'works' };
  //     }

  //     return { fetchMethod: 'works' };
  //   });

  //   const POST_PARAMS = { book: { title: 'Security Analysis' } };

  //   http.post('/private-http', POST_PARAMS).then((response) => {
  //     assert.deepEqual(response.data, { fetchMethod: 'works' });

  //     return http.post('/private-http?testing=true', POST_PARAMS);
  //   }).then(({ data }) => {
  //     assert.deepEqual(data, { testing: 'works' });

  //     return http.post(`${ENV.APP.API_HOST}/private-http`, POST_PARAMS, { 'accept-language': 'nl' });
  //   }).then((response) => {
  //     assert.deepEqual(response.data, { fetchMethod: 'works' });
  //     assert.equal(response.request.headers['accept-language'], 'nl');

  //     return http.post(`${ENV.APP.API_HOST}/private-http?testing=true`, POST_PARAMS, {
  //       'accept-language': 'nl'
  //     });
  //   }).then((response) => {
  //     assert.deepEqual(response.data, { testing: 'works' });
  //     assert.equal(response.request.headers['accept-language'], 'nl');

  //     done();
  //   });
  // });

  // test('http.post() calls catch when there are errors', function(assert) {
  //   assert.expect(15);

  //   let http = this.owner.lookup('service:http');
  //   let done = assert.async();

  //   http.post('/private-http').catch((response) => {
  //     assert.equal(response.message, 'Network Error');

  //     this.Server = new Memserver({ initializer, routes });

  //     this.Server.post('/private-http', () => {
  //       return Response(500, { error: 'Unexpected error occured' });
  //     });

  //     return http.post('/private-http');
  //   }).catch((error) => {
  //     assert.equal(error.message, 'Request failed with status code 500');
  //     assert.equal(error.response.status, 500);
  //     assert.deepEqual(error.response.data, { error: 'Unexpected error occured' });

  //     this.Server.post('/private-http', () => {
  //       return Response(404, { error: { message: 'Not found' } });
  //     });

  //     return http.post(`${ENV.APP.API_HOST}/private-http`);
  //   }).catch((error) => {
  //     assert.equal(error.message, 'Request failed with status code 404');
  //     assert.equal(error.response.status, 404);
  //     assert.deepEqual(error.response.data, { error: { message: 'Not found' } });

  //     this.Server.post('/private-http', () => {
  //       return Response(422, { error: 'Unprocessable thing' });
  //     });

  //     return http.post(`${ENV.APP.API_HOST}/private-http`);
  //   }).catch((error) => {
  //     assert.equal(error.message, 'Request failed with status code 422');
  //     assert.equal(error.response.status, 422);
  //     assert.deepEqual(error.response.data, { error: 'Unprocessable thing' });

  //     this.Server.post('/private-http', () => {
  //       return Response(401, { error: 'unauthorized' });
  //     });

  //     return http.post('/private-http');
  //   }).catch((error) => {
  //     assert.equal(error.message, 'Request failed with status code 401');
  //     assert.equal(error.response.status, 401);
  //     assert.deepEqual(error.response.data, { error: 'unauthorized' });

  //     this.Server.post('/private-http', () => {
  //       return { user:  { name: 'it works' } };
  //     });

  //     return http.post('/private-http');
  //   }).then((response) => {
  //     assert.equal(response.status, 201);
  //     assert.deepEqual(response.data, { user:  { name: 'it works' } });

  //     done();
  //   });
  // });

  // test('http.put() works for a visitor', function(assert) {
  //   assert.expect(16);

  //   this.Server = new Memserver({ initializer, routes });

  //   let http = this.owner.lookup('service:http');
  //   let done = assert.async();

  //   const PUT_PARAMS = { book: { title: 'Security Analysis' } };

  //   this.Server.put('/testing-http', ({ params, headers, queryParams }) => {
  //     assert.deepEqual(params, PUT_PARAMS);

  //     if (Object.keys(headers).length > 2) {
  //       assert.deepEqual(headers, {
  //         'Accept': 'application/json, text/plain, */*',
  //         'Content-Type': 'application/json',
  //         'accept-language': 'nl'
  //       });
  //     } else {
  //       assert.deepEqual(headers, {
  //         'Accept': 'application/json, text/plain, */*',
  //         'Content-Type': 'application/json'
  //       });
  //     }

  //     if (Object.keys(queryParams).length > 0) {
  //       assert.deepEqual(queryParams, { testing: true });

  //       return { testing: 'works' };
  //     }

  //     return { fetchMethod: 'works' };
  //   });

  //   http.put('/testing-http', PUT_PARAMS).then((response) => {
  //     assert.deepEqual(response.data, { fetchMethod: 'works' });

  //     return http.put('/testing-http?testing=true', PUT_PARAMS);
  //   }).then(({ data }) => {
  //     assert.deepEqual(data, { testing: 'works' });

  //     return http.put(`${ENV.APP.API_HOST}/testing-http`, PUT_PARAMS, { 'accept-language': 'nl' });
  //   }).then((response) => {
  //     assert.deepEqual(response.data, { fetchMethod: 'works' });
  //     assert.equal(response.request.headers['accept-language'], 'nl');

  //     return http.put(`${ENV.APP.API_HOST}/testing-http?testing=true`, PUT_PARAMS, {
  //       'accept-language': 'nl'
  //     });
  //   }).then((response) => {
  //     assert.deepEqual(response.data, { testing: 'works' });
  //     assert.equal(response.request.headers['accept-language'], 'nl');

  //     done();
  //   });
  // });

  // test('http.put() works for a loggedin user', function(assert) {
  //   assert.expect(20);

  //   authentication.login(IZEL);
  //   this.Server = new Memserver({ initializer, routes });

  //   let http = this.owner.lookup('service:http');
  //   let done = assert.async();

  //   this.Server.put('/private-http', ({ params, headers, queryParams }) => {
  //     const token = `Bearer ${IZEL.authentication_token}`;

  //     assert.equal(headers.Authorization, token);
  //     assert.deepEqual(params, { book: { title: 'Security Analysis' } });

  //     if (headers.Authorization !== token) {
  //       return Response(401, { message: 'unauthorized' });
  //     }

  //     if (Object.keys(headers).length > 3) {
  //       assert.deepEqual(headers, {
  //         'Authorization': `Bearer ${IZEL.authentication_token}`,
  //         'Accept': 'application/json, text/plain, */*',
  //         'Content-Type': 'application/json',
  //         'accept-language': 'nl'
  //       });
  //     } else {
  //       assert.deepEqual(headers, {
  //         'Authorization': `Bearer ${IZEL.authentication_token}`,
  //         'Accept': 'application/json, text/plain, */*',
  //         'Content-Type': 'application/json'
  //       });
  //     }

  //     if (Object.keys(queryParams).length > 0) {
  //       assert.deepEqual(queryParams, { testing: true });

  //       return { testing: 'works' };
  //     }

  //     return { fetchMethod: 'works' };
  //   });

  //   const POST_PARAMS = { book: { title: 'Security Analysis' } };

  //   http.put('/private-http', POST_PARAMS).then((response) => {
  //     assert.deepEqual(response.data, { fetchMethod: 'works' });

  //     return http.put('/private-http?testing=true', POST_PARAMS);
  //   }).then(({ data }) => {
  //     assert.deepEqual(data, { testing: 'works' });

  //     return http.put(`${ENV.APP.API_HOST}/private-http`, POST_PARAMS, { 'accept-language': 'nl' });
  //   }).then((response) => {
  //     assert.deepEqual(response.data, { fetchMethod: 'works' });
  //     assert.equal(response.request.headers['accept-language'], 'nl');

  //     return http.put(`${ENV.APP.API_HOST}/private-http?testing=true`, POST_PARAMS, {
  //       'accept-language': 'nl'
  //     });
  //   }).then((response) => {
  //     assert.deepEqual(response.data, { testing: 'works' });
  //     assert.equal(response.request.headers['accept-language'], 'nl');

  //     done();
  //   });
  // });

  // test('http.put() calls catch when there are errors', function(assert) {
  //   assert.expect(15);

  //   let http = this.owner.lookup('service:http');
  //   let done = assert.async();

  //   http.put('/private-http').catch((response) => {
  //     assert.equal(response.message, 'Network Error');

  //     this.Server = new Memserver({ initializer, routes });

  //     this.Server.put('/private-http', () => {
  //       return Response(500, { error: 'Unexpected error occured' });
  //     });

  //     return http.put('/private-http');
  //   }).catch((error) => {
  //     assert.equal(error.message, 'Request failed with status code 500');
  //     assert.equal(error.response.status, 500);
  //     assert.deepEqual(error.response.data, { error: 'Unexpected error occured' });

  //     this.Server.put('/private-http', () => {
  //       return Response(404, { error: { message: 'Not found' } });
  //     });

  //     return http.put(`${ENV.APP.API_HOST}/private-http`);
  //   }).catch((error) => {
  //     assert.equal(error.message, 'Request failed with status code 404');
  //     assert.equal(error.response.status, 404);
  //     assert.deepEqual(error.response.data, { error: { message: 'Not found' } });

  //     this.Server.put('/private-http', () => {
  //       return Response(422, { error: 'Unprocessable thing' });
  //     });

  //     return http.put(`${ENV.APP.API_HOST}/private-http`);
  //   }).catch((error) => {
  //     assert.equal(error.message, 'Request failed with status code 422');
  //     assert.equal(error.response.status, 422);
  //     assert.deepEqual(error.response.data, { error: 'Unprocessable thing' });

  //     this.Server.put('/private-http', () => {
  //       return Response(401, { error: 'unauthorized' });
  //     });

  //     return http.put('/private-http');
  //   }).catch((error) => {
  //     assert.equal(error.message, 'Request failed with status code 401');
  //     assert.equal(error.response.status, 401);
  //     assert.deepEqual(error.response.data, { error: 'unauthorized' });

  //     this.Server.put('/private-http', () => {
  //       return { user:  { name: 'it works' } };
  //     });

  //     return http.put('/private-http');
  //   }).then((response) => {
  //     assert.equal(response.status, 200);
  //     assert.deepEqual(response.data, { user:  { name: 'it works' } });

  //     done();
  //   });
  // });

  // test('http.delete() works for a visitor', function(assert) {
  //   assert.expect(13);

  //   this.Server = new Memserver({ initializer, routes });

  //   let http = this.owner.lookup('service:http');
  //   let done = assert.async();

  //   this.Server.delete('/testing-http', ({ headers, queryParams }) => {
  //     if (Object.keys(headers).length > 2) {
  //       assert.deepEqual(headers, {
  //         'Accept': 'application/json, text/plain, */*',
  //         'Content-Type': 'text/plain;charset=UTF-8',
  //         'accept-language': 'nl'
  //       });
  //     } else {
  //       assert.deepEqual(headers, {
  //         'Accept': 'application/json, text/plain, */*',
  //         'Content-Type': 'text/plain;charset=UTF-8'
  //       });
  //     }

  //     if (Object.keys(queryParams).length > 0) {
  //       assert.deepEqual(queryParams, { testing: true });

  //       return { testing: 'works' };
  //     }

  //     return Response(204, {});
  //   });

  //   http.delete('/testing-http').then((response) => {
  //     assert.deepEqual(response.data, {});

  //     return http.delete('/testing-http?testing=true');
  //   }).then(({ data }) => {
  //     assert.deepEqual(data, { testing: 'works' });

  //     return http.delete(`${ENV.APP.API_HOST}/testing-http`, { 'accept-language': 'nl' });
  //   }).then((response) => {
  //     assert.deepEqual(response.status, 204);
  //     assert.deepEqual(response.data, {});
  //     assert.equal(response.request.headers['accept-language'], 'nl');

  //     return http.delete(`${ENV.APP.API_HOST}/testing-http?testing=true`, {
  //       'accept-language': 'nl'
  //     });
  //   }).then((response) => {
  //     assert.deepEqual(response.data, { testing: 'works' });
  //     assert.equal(response.request.headers['accept-language'], 'nl');

  //     done();
  //   });
  // });

  // test('http.delete() works for a loggedin user', function(assert) {
  //   assert.expect(17);

  //   authentication.login(IZEL);
  //   this.Server = new Memserver({ initializer, routes });

  //   let http = this.owner.lookup('service:http');
  //   let done = assert.async();

  //   this.Server.delete('/private-http', ({ headers, queryParams }) => {
  //     const token = `Bearer ${IZEL.authentication_token}`;

  //     assert.equal(headers.Authorization, token);

  //     if (headers.Authorization !== token) {
  //       return Response(401, { message: 'unauthorized' });
  //     }

  //     if (Object.keys(headers).length > 3) {
  //       assert.deepEqual(headers, {
  //         'Authorization': `Bearer ${IZEL.authentication_token}`,
  //         'Accept': 'application/json, text/plain, */*',
  //         'Content-Type': 'text/plain;charset=UTF-8',
  //         'accept-language': 'nl'
  //       });
  //     } else {
  //       assert.deepEqual(headers, {
  //         'Authorization': `Bearer ${IZEL.authentication_token}`,
  //         'Accept': 'application/json, text/plain, */*',
  //         'Content-Type': 'text/plain;charset=UTF-8'
  //       });
  //     }

  //     if (Object.keys(queryParams).length > 0) {
  //       assert.deepEqual(queryParams, { testing: true });

  //       return { testing: 'works' };
  //     }
  //   });

  //   http.delete('/private-http').then((response) => {
  //     assert.deepEqual(response.data, {});

  //     return http.delete('/private-http?testing=true');
  //   }).then(({ status, data }) => {
  //     assert.equal(status, 204);
  //     assert.deepEqual(data, { testing: 'works' });

  //     return http.delete(`${ENV.APP.API_HOST}/private-http`, { 'accept-language': 'nl' });
  //   }).then((response) => {
  //     assert.deepEqual(response.data, {});
  //     assert.equal(response.request.headers['accept-language'], 'nl');

  //     return http.delete(`${ENV.APP.API_HOST}/private-http?testing=true`, {
  //       'accept-language': 'nl'
  //     });
  //   }).then((response) => {
  //     assert.deepEqual(response.data, { testing: 'works' });
  //     assert.equal(response.request.headers['accept-language'], 'nl');

  //     done();
  //   });
  // });

  // test('http.delete() calls catch when there are errors', function(assert) {
  //   assert.expect(15);

  //   let http = this.owner.lookup('service:http');
  //   let done = assert.async();

  //   http.delete('/private-http').catch((response) => {
  //     assert.equal(response.message, 'Network Error');

  //     this.Server = new Memserver({ initializer, routes });

  //     this.Server.delete('/private-http', () => {
  //       return Response(500, { error: 'Unexpected error occured' });
  //     });

  //     return http.delete('/private-http');
  //   }).catch((error) => {
  //     assert.equal(error.message, 'Request failed with status code 500');
  //     assert.equal(error.response.status, 500);
  //     assert.deepEqual(error.response.data, { error: 'Unexpected error occured' });

  //     this.Server.delete('/private-http', () => {
  //       return Response(404, { error: { message: 'Not found' } });
  //     });

  //     return http.delete(`${ENV.APP.API_HOST}/private-http`);
  //   }).catch((error) => {
  //     assert.equal(error.message, 'Request failed with status code 404');
  //     assert.equal(error.response.status, 404);
  //     assert.deepEqual(error.response.data, { error: { message: 'Not found' } });

  //     this.Server.delete('/private-http', () => {
  //       return Response(422, { error: 'Unprocessable thing' });
  //     });

  //     return http.delete(`${ENV.APP.API_HOST}/private-http`);
  //   }).catch((error) => {
  //     assert.equal(error.message, 'Request failed with status code 422');
  //     assert.equal(error.response.status, 422);
  //     assert.deepEqual(error.response.data, { error: 'Unprocessable thing' });

  //     this.Server.delete('/private-http', () => {
  //       return Response(401, { error: 'unauthorized' });
  //     });

  //     return http.delete('/private-http');
  //   }).catch((error) => {
  //     assert.equal(error.message, 'Request failed with status code 401');
  //     assert.equal(error.response.status, 401);
  //     assert.deepEqual(error.response.data, { error: 'unauthorized' });

  //     this.Server.delete('/private-http', () => {
  //       return {};
  //     });

  //     return http.delete('/private-http');
  //   }).then((response) => {
  //     assert.equal(response.status, 204);
  //     assert.deepEqual(response.data, {});

  //     done();
  //   });
  // });
});
