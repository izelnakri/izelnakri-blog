import EmberObject from '@ember/object';
import TooltipMixin from './tooltip';
import { module, test } from 'qunit';

module('Unit | Mixin | tooltip', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let TooltipObject = EmberObject.extend(AuthMixin);
    let subject = TooltipMixin.create();
    assert.ok(subject);
  });
});
