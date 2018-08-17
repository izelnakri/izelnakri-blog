import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'frontend/tests/helpers';

module('Integration | Helper | datetime', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('inputValue', new Date('2018-05-14T14:17:37.126Z'));

    await render(hbs`{{datetime inputValue}}`);

    assert.ok(this.element.textContent.includes('May 14, 2018'));
    assert.ok(/\d+:\d+/g.test(this.element.textContent));
  });
});
