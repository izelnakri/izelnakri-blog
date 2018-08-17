import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'frontend/tests/helpers';

module('Integration | Helper | is-equal', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('inputValue', true);

    await render(hbs`{{is-equal true true}}`);

    assert.equal(this.element.textContent.trim(), 'true');

    await render(hbs`{{is-equal true false}}`);

    assert.equal(this.element.textContent.trim(), 'false');

    await render(hbs`{{is-equal false false}}`);

    assert.equal(this.element.textContent.trim(), 'true');
  });
});
