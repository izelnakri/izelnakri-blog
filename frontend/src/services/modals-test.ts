import { module, test } from 'qunit';
import { setupTest } from 'frontend/tests/helpers';
import { A } from '@ember/array';
import { run } from '@ember/runloop';

module('Unit | Service | Modals', function (hooks) {
  const LOGIN_MODAL = {
    componentName: 'modal/login',
    context: {},
    model: {
      title: 'This is modals title',
    },
    name: 'login',
  };
  const CONFIRMATION_MODAL = {
    componentName: 'modal/confirmation-window',
    context: {},
    model: {
      title: 'This is a confirmation',
    },
    name: 'confirmation-window',
  };

  setupTest(hooks);

  test('it exists', function (assert) {
    const service = this.owner.lookup('service:modals');

    assert.ok(service);
  });

  test('.open() pushes a modal component object to model and returns a promise', function (assert) {
    const service = this.owner.lookup('service:modals');
    const response = service.open('login', { title: 'This is modals title' });

    assert.deepEqual(service.model, [LOGIN_MODAL]);
    assert.equal(service.promises.length, 1);
    assert.ok(Object.keys(service.get('promises.firstObject')).includes('resolve'));
    assert.ok(Object.keys(service.get('promises.firstObject')).includes('reject'));
    assert.ok(Object.keys(service.get('promises.firstObject.promise').__proto__).includes('then'));
    assert.deepEqual(service.get('promises.lastObject.promise'), response);

    const newResponse = service.open('confirmation-window', { title: 'This is a confirmation' });

    assert.deepEqual(service.model, [LOGIN_MODAL, CONFIRMATION_MODAL]);
    assert.equal(service.promises.length, 2);
    assert.ok(Object.keys(service.get('promises.lastObject')).includes('resolve'));
    assert.ok(Object.keys(service.get('promises.lastObject')).includes('reject'));
    assert.ok(Object.keys(service.get('promises.lastObject.promise').__proto__).includes('then'));
    assert.deepEqual(service.get('promises.lastObject.promise'), newResponse);
  });

  test('.openWithoutPromise() pushes a model component without promise', function (assert) {
    const service = this.owner.lookup('service:modals');
    // TODO: also assert against promises

    service.model = A();

    run(() => service.openWithoutPromise('login', { title: 'This is modals title' }));

    assert.deepEqual(service.model, [LOGIN_MODAL]);

    run(() => service.open('login', { title: 'This is modals title' }));
    run(() =>
      service.openWithoutPromise('confirmation-window', {
        title: 'This is a confirmation',
      })
    );

    assert.deepEqual(service.model, [LOGIN_MODAL, LOGIN_MODAL, CONFIRMATION_MODAL]);
  });

  test('.close() works', function (assert) {
    const service = this.owner.lookup('service:modals');

    service.model = A();

    service.open('login', { title: 'This is modals title' });
    service.open('confirmation-window', { title: 'This is a confirmation' });
    service.open('confirmation-window', { title: 'This is a confirmation' });
    service.open('login', { title: 'This is modals title' });
    service.open('confirmation-window', { title: 'This is a confirmation' });

    assert.deepEqual(service.model, [
      LOGIN_MODAL,
      CONFIRMATION_MODAL,
      CONFIRMATION_MODAL,
      LOGIN_MODAL,
      CONFIRMATION_MODAL,
    ]);

    service.close();

    assert.deepEqual(service.model, [
      LOGIN_MODAL,
      CONFIRMATION_MODAL,
      CONFIRMATION_MODAL,
      LOGIN_MODAL,
    ]);

    service.close();

    assert.deepEqual(service.model, [LOGIN_MODAL, CONFIRMATION_MODAL, CONFIRMATION_MODAL]);

    service.close();

    assert.deepEqual(service.model, [LOGIN_MODAL, CONFIRMATION_MODAL]);

    service.close();

    assert.deepEqual(service.model, [LOGIN_MODAL]);
  });
});
