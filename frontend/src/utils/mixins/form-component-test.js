import EmberObject from '@ember/object';
import FormComponentMixin from './form-component';
import { module, test } from 'qunit';

module('Unit | Mixin | form-component', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let FormComponentObject = EmberObject.extend(AuthMixin);
    let subject = FormComponentMixin.create();
    assert.ok(subject);
  });
});
