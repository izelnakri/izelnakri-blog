import { module, test } from 'qunit';
import { click, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | Component | <Button/>', function (hooks) {
  setupRenderingTest(hooks);

  test('can render a default Button', async function (assert) {
    await render(hbs`<Button />`);

    const button = this.element.querySelector('button');

    assert.equal(button.getAttribute('class').trim(), 'btn btn-primary');
    assert.equal(button.type, 'button');
  });

  test('can render a secondary block outlined button', async function (assert) {
    await render(
      hbs`<Button @style="secondary" @outline={{true}} @block={{true}} @type="submit"/>`
    );

    const button = this.element.querySelector('button');

    assert.equal(button.getAttribute('class').trim(), 'btn btn-outline-secondary  btn-block');
    assert.equal(button.type, 'submit');
  });

  test('can render a large circular button which with custom click handler', async function (assert) {
    assert.expect(2);

    this.clickHandler = () => assert.ok(true, 'click handler is called');

    await render(
      hbs`<Button @style="danger" @circle={{true}} @size="lg" @onClick={{action this.clickHandler}}/>`
    );

    const button = this.element.querySelector('button');

    assert.equal(button.getAttribute('class').trim(), 'btn btn-danger btn-lg  btn-circle');

    await click('button[data-test-button]');
  });

  test('can render a disabled button', async function (assert) {
    assert.expect(2);

    this.clickHandler = () => assert.ok(true, 'click handler is called');

    await render(
      hbs`<Button @style="warning" @disabled={{true}} @onClick={{action this.clickHandler}}/>`
    );

    const button = this.element.querySelector('button');

    assert.equal(button.getAttribute('class').trim(), 'btn btn-warning');
    assert.equal(button.disabled, true);

    await click('button[data-test-button]');
  });
});

// NOTE: add tooltip tests in future
