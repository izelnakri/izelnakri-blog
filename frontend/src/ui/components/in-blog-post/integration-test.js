import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'frontend/tests/helpers';

module('Integration | Component | in-blog-post', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{in-blog-post}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#in-blog-post}}
        template block text
      {{/in-blog-post}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
