import { module, test } from 'qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'frontend/tests/helpers';

module('Integration | Component | FlashMessage', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders info flash by default', async function (assert) {
    await render(hbs`<FlashMessage/>`);

    assert.dom('.alert.alert-info').exists();
    assert.dom('.alert.alert-info').hasText('×');
    assert.dom('[data-test-flash-message-close-button]').exists();

    await render(hbs`
      <FlashMessage>
        template block text
      </FlashMessage>
    `);

    assert.dom('.alert.alert-info').exists();
    assert.dom('.alert.alert-info').includesText('template block text');
    assert.dom('[data-test-flash-message-close-button]').exists();
  });

  test('it works for success, info, success, warning', async function (assert) {
    assert.expect(8);

    await render(hbs`
      <FlashMessage @type="success">
        success message
      </FlashMessage>
    `);

    assert.dom('.alert.alert-success').exists();
    assert.dom('.alert.alert-success').includesText('success message');

    await render(hbs`
      <FlashMessage @type="warning">
        warning message
      </FlashMessage>
    `);

    assert.dom('.alert.alert-warning').exists();
    assert.dom('.alert.alert-warning').includesText('warning message');

    await render(hbs`
      <FlashMessage @type="danger">
        danger message
      </FlashMessage>
    `);

    assert.dom('.alert.alert-danger').exists();
    assert.dom('.alert.alert-danger').includesText('danger message');

    await render(hbs`
      <FlashMessage @type="custom">
        custom message
      </FlashMessage>
    `);

    assert.dom('.alert.alert-custom').exists();
    assert.dom('.alert.alert-custom').includesText('custom message');
  });

  test('user can close the flash message via close button and can fire onClose', async function (assert) {
    assert.expect(3);

    this.onDestroy = (flashObject) => {
      assert.deepEqual(flashObject, { id: null, message: '', type: 'success', timeout: null });
    };

    await render(hbs`
      <FlashMessage @type="success" @onDestroy={{this.onDestroy}}>
        success message
      </FlashMessage>
    `);

    assert.dom('.alert.alert-success').exists();

    await click('[data-test-flash-message-close-button]');

    assert.dom('.alert.alert-success').doesNotExist();
  });
});
