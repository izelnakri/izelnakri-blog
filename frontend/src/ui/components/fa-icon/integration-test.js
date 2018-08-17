import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'frontend/tests/helpers';

module('Integration | Component | fa-icon', function(hooks) {
  setupRenderingTest(hooks);

  test('can render an fa icon', async function(assert) {
    await render(hbs`{{fa-icon "close"}}`);

    const expectedClasses = 'fas fa-icon fa-close ember-view';

    assert.equal(this.element.querySelector('.fas').getAttribute('class'), expectedClasses);
  });

  test('can render another icon with different options', async function(assert) {
    await render(hbs`{{fa-icon "check" spin=true size="lg" circle=true fixedWidth=true}}`);

    const expectedClasses = 'fas fa-icon fa-check fa-fw fa-round fa-lg fa-spin ember-view';

    assert.equal(this.element.querySelector('.fas').getAttribute('class'), expectedClasses);
  });
});

// NOTE: later test that tooltip works
