import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'frontend/tests/helpers';

module('Integration | Component | in-modal/confirmation-modal', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{in-modal/confirmation-modal}}`);

    assert.ok(this.element.querySelector('.modal-header').textContent.includes('Are you sure?'));
    assert.ok(this.element.querySelector('.modal-body').textContent.includes('Are you sure you want to do this?'));
  });
});
