import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'frontend/tests/helpers';

module('Integration | Helper | date', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('inputValue', new Date('1992-04-01'));

    await render(hbs`{{date inputValue}}`);

    assert.equal(this.element.textContent.trim(), 'April 01, 1992');
  });
});
