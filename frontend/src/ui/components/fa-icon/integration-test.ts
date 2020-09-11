import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'frontend/tests/helpers';

module('Integration | Component | <FaIcon/>', function (hooks) {
  setupRenderingTest(hooks);

  test('can render an fa icon', async function (assert) {
    await render(hbs`<FaIcon @icon="close"/>`);

    assert.dom('i').hasClass('fas');
    assert.dom('i').hasClass('fa-icon');
    assert.dom('i').hasClass('fa-close');
    assert.dom('i').doesNotHaveClass('fa-fw');
    assert.dom('i').doesNotHaveClass('fa-round');
    assert.dom('i').doesNotHaveClass('fa-lg');
    assert.dom('i').doesNotHaveClass('fa-spin');
  });

  test('can render another icon with different options', async function (assert) {
    await render(
      hbs`<FaIcon @icon="check" @spin={{true}} @size="lg" @circle={{true}} @fixedWidth={{true}}/>`
    );

    assert.dom('i').hasClass('fas');
    assert.dom('i').hasClass('fa-icon');
    assert.dom('i').hasClass('fa-check');
    assert.dom('i').hasClass('fa-fw');
    assert.dom('i').hasClass('fa-round');
    assert.dom('i').hasClass('fa-lg');
    assert.dom('i').hasClass('fa-spin');
  });
});

// NOTE: later test that tooltip works
