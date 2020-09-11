import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'frontend/tests/helpers';

module('Integration | Helper | is-equal', function (hooks) {
  setupRenderingTest(hooks);

  test('it returns true when left hand equals to right hand', async function (assert) {
    const me = { name: 'Izel', lastName: 'Nakri' };

    this.data = me;

    await render(hbs`[{{is-equal data data}}]`);

    assert.equal(this.element.textContent.trim(), '[true]');

    this.data = 'abc';

    await render(hbs`[{{is-equal data data}}]`);

    assert.equal(this.element.textContent.trim(), '[true]');

    this.data = 5;

    await render(hbs`[{{is-equal me me}}]`);

    assert.equal(this.element.textContent.trim(), '[true]');

    this.data = true;

    await render(hbs`[{{is-equal me me}}]`);

    assert.equal(this.element.textContent.trim(), '[true]');
  });

  test('it returns false when left hand isnt equal to the right hand', async function (assert) {
    const me = { name: 'Izel', lastName: 'Nakri' };
    const otherObject = { name: 'Izel' };

    this.data = me;
    this.otherObject = otherObject;

    await render(hbs`[{{is-equal data otherObject}}]`);

    assert.equal(this.element.textContent.trim(), '[false]');

    this.data = 'abc';

    await render(hbs`[{{is-equal data "cde"}}]`);

    assert.equal(this.element.textContent.trim(), '[false]');

    this.data = 5;

    await render(hbs`[{{is-equal data 1}}]`);

    assert.equal(this.element.textContent.trim(), '[false]');

    this.data = true;
    this.otherValue = false;

    await render(hbs`[{{is-equal data otherValue}}]`);

    assert.equal(this.element.textContent.trim(), '[false]');
  });
});
