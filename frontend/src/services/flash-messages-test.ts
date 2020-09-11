import { module, test } from 'qunit';
import { setupTest } from 'frontend/tests/helpers';
import { settled } from '@ember/test-helpers';
import wait from 'frontend/tests/helpers/wait';

module('Unit | Service | FlashMessages', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let service = this.owner.lookup('service:flash-messages');

    service.timeout = 10;

    assert.ok(service);
  });

  test('it has correct API', async function (assert) {
    assert.expect(5);

    let service = this.owner.lookup('service:flash-messages');
    service.timeout = 10;
    let serviceProperties = Object.keys(service);

    ['timeout', 'preventDuplicates', 'sticky', 'queue'].forEach((key) =>
      assert.ok(serviceProperties.includes(key))
    );
    service.success('success message');
    service.info('info message');
    service.warning('warning message');
    service.danger('danger message');

    assert.equal(service.queue.length, 4);
  });

  test('user can attach onDestroy action to a message and clearFlashMessage works', async function (assert) {
    assert.expect(2);

    let service = this.owner.lookup('service:flash-messages');

    assert.equal(service.queue.length, 0);

    service.success('success message is this', {
      timeout: 0,
      onDestroy() {
        assert.ok(true);
      },
    });

    await settled();
  });

  test('can push flash messages to queue with a default timeout', async function (assert) {
    assert.expect(10);

    let service = this.owner.lookup('service:flash-messages');

    service.timeout = 200;

    assert.equal(service.queue.length, 0);

    service.success('success message', {
      onDestroy() {
        assert.ok(true);
      },
    });

    await wait(60);

    assert.equal(service.queue.length, 1);

    await wait(60);

    service.success('success message', {
      onDestroy() {
        assert.ok(true);
      },
    });

    assert.equal(service.queue.length, 2);

    await wait(60);

    service.info('info message', {
      onDestroy() {
        assert.ok(true);
      },
    });

    assert.equal(service.queue.length, 3);

    await wait(60);

    assert.equal(service.queue.length, 2);

    await wait(100);

    assert.equal(service.queue.length, 1);

    await wait(110);

    assert.equal(service.queue.length, 0);
  });

  test('can pop different messages and then cleanMessages() cleans them and calls the onDestroys', async function (assert) {
    assert.expect(8);

    let service = this.owner.lookup('service:flash-messages');

    service.timeout = 100;
    assert.equal(service.queue.length, 0);

    service.success('success message', {
      onDestroy() {
        assert.ok(true);
      },
    });

    assert.equal(service.queue.length, 1);

    service.success('success message', {
      onDestroy() {
        assert.ok(true);
      },
    });

    assert.equal(service.queue.length, 2);

    service.info('info message', {
      onDestroy() {
        assert.ok(true);
      },
    });

    assert.equal(service.queue.length, 3);

    await service.clearMessages();
    await wait(110);

    assert.equal(service.queue.length, 0);
  });

  test('user can send different messages with different timeouts', async function (assert) {
    assert.expect(7);

    let service = this.owner.lookup('service:flash-messages');

    service.timeout = 50;
    assert.equal(service.queue.length, 0);

    service.success('success message', {
      timeout: 100,
      onDestroy() {
        assert.ok(true);
      },
    });

    await wait(70);

    const queueObject = service.queue[0];

    assert.equal(queueObject.type, 'success');
    assert.equal(queueObject.message, 'success message');

    service.info('info message', {
      timeout: 150,
      onDestroy() {
        assert.ok(true);
      },
    });

    await wait(70);

    const lastQueueObject = service.queue[0];

    assert.equal(lastQueueObject.type, 'info');
    assert.equal(lastQueueObject.message, 'info message');

    await wait(80);
  });

  test('user can attach a sticky flash message', async function (assert) {
    assert.expect(2);

    let service = this.owner.lookup('service:flash-messages');

    service.timeout = 50;
    assert.equal(service.queue.length, 0);

    service.info('info message', {
      timeout: 70,
      sticky: true,
      onDestroy() {
        assert.ok(true);
      },
    });

    await wait(80);

    assert.equal(service.queue.length, 1);
  });

  test('user can preventDuplicates', async function (assert) {
    assert.expect(9);

    let service = this.owner.lookup('service:flash-messages');

    service.timeout = 50;
    service.preventDuplicates = true;

    assert.equal(service.queue.length, 0);

    service.success('success message', {
      onDestroy() {
        assert.ok(true);
      },
    });

    assert.equal(service.queue.length, 1);

    service.success('success message', {
      onDestroy() {
        assert.ok(true);
      },
    });

    assert.equal(service.queue.length, 1);

    service.info('info message', {
      onDestroy() {
        assert.ok(true);
      },
    });

    assert.equal(service.queue.length, 1);

    const queueObject = service.queue[0];

    assert.equal(queueObject.type, 'info');
    assert.equal(queueObject.message, 'info message');

    await wait(50);
  });
});
