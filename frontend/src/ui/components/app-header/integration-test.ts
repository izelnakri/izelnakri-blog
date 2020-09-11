import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'frontend/tests/helpers';

module('Integration | Component | in-header', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<AppHeader />`);

    assert.equal(this.element.textContent.trim(), 'Izel Nakri | Blog');
  });
});
