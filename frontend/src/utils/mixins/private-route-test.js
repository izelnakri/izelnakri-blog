import EmberObject from '@ember/object';
import PrivateRouteMixin from './private-route';
import { module, test } from 'qunit';

module('Unit | Mixin | private-route', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let PrivateRouteObject = EmberObject.extend(PrivateRouteMixin);
    let subject = PrivateRouteObject.create();
    assert.ok(subject);
  });
});
