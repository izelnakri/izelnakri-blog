import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | BlogPost', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('blog-post', {});

    assert.ok(model);
  });
});
