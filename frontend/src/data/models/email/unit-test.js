import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | email', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('email', {});

    assert.ok(model);
  });
});
