import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | base', function(hooks) {
  setupApplicationTest(hooks);

  // test('visiting /route', async function(assert) {
  //   await visit('/route');
  //
  //   assert.equal(currentURL(), '/route');
  // });
});
