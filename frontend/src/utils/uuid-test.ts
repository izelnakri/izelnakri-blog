import uuid from './uuid';
import { module, test } from 'qunit';

module('Unit | Util | uuid', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let result = uuid();
    assert.ok(result);
  });
});
