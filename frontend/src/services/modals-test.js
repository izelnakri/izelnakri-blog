import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | modals', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let service = this.owner.lookup('service:modals');

    assert.ok(service);
  });
});
