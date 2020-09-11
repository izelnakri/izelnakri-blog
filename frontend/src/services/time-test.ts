import { module, test } from 'qunit';
import { setupTest } from 'frontend/tests/helpers';

module('Unit | Service | Time', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const service = this.owner.lookup('service:time');

    assert.ok(service);
  });

  test('time increments every second', function (assert) {
    const service = this.owner.lookup('service:time');
    const firstNow = service.now;

    assert.ok(firstNow);

    let done = assert.async();

    window.setTimeout(() => {
      const secondNow = service.now;

      assert.ok(secondNow);
      assert.notEqual(secondNow, firstNow);

      window.setTimeout(() => {
        const thirdNow = service.now;

        assert.ok(thirdNow);
        assert.notEqual(secondNow, thirdNow);

        done();
      }, 1025);
    }, 1025);
  });
});
