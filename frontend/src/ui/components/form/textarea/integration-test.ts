import { module, test } from 'qunit';
import { fillIn, render } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'frontend/tests/helpers';
// import { startMemServer } from 'frontend/instance-initializers/memserver';

module('Integration | Component | <Form::Textarea/>', function (hooks) {
  setupRenderingTest(hooks);

  // hooks.beforeEach(function() {
  //   startMemServer();
  //   window.MemServer.post('/people');
  // });

  // hooks.afterEach(function() {
  //   window.MemServer.shutdown();
  // });

  test('can render default value correctly and user can change it', async function (assert) {
    buildPerson(this);

    await render(hbs`
      <Form @model={{this.person}} as |form|>
        <form.textarea @attribute="description"/>
      </Form>
    `);

    assert.equal(this.person.description, null);

    const input = this.element.querySelector('textarea[name="person.description"]');

    assert.equal(input.value, '');
    assert.equal(input.placeholder, 'Missing translation: models.person.description');
    assert.equal(input.getAttribute('id'), 'person.description');
    assert.equal(input.required, false);
    assert.equal(input.autofocus, false);
    assert.equal(input.getAttribute('rows'), '3');
    assert.dom('[data-test-input-label="person.description"]').doesNotExist();

    await fillIn(
      '[data-test-input="person.description"]',
      'Making the world a better place through groundbreaking technologies'
    );

    assert.dom('[data-test-input-label="person.description"]').hasText('Missing translation: models.person.description:');
    assert.equal(
      input.value,
      'Making the world a better place through groundbreaking technologies'
    );
    assert.equal(
      this.person.description,
      'Making the world a better place through groundbreaking technologies'
    );

    await fillIn('[data-test-input="person.description"]', 'Web programmer, a digital plumber.');

    assert.equal(input.value, 'Web programmer, a digital plumber.');
    assert.equal(this.person.description, 'Web programmer, a digital plumber.');
  });

  test('can render existing value correctly and user can change it', async function (assert) {
    buildPerson(this);
    this.person.description = 'Making the world a better place';

    await render(hbs`
      <Form @model={{this.person}} as |form|>
        <form.textarea @attribute="description"/>
      </Form>
    `);

    assert.equal(this.person.description, 'Making the world a better place');

    const input = this.element.querySelector('textarea[name="person.description"]');

    assert.equal(input.value, 'Making the world a better place');
    assert.equal(input.placeholder, 'Missing translation: models.person.description');
    assert.equal(input.getAttribute('id'), 'person.description');
    assert.equal(input.required, false);
    assert.equal(input.autofocus, false);
    assert.equal(input.getAttribute('rows'), '3');
    assert.dom('[data-test-input-label="person.description"]').hasText('Missing translation: models.person.description:');

    await fillIn('[data-test-input="person.description"]', '');

    assert.equal(input.value, '');
    assert.equal(this.person.description, '');

    await fillIn('[data-test-input="person.description"]', 'Web programmer, a digital plumber.');

    assert.dom('[data-test-input-label="person.description"]').hasText('Missing translation: models.person.description:');
    assert.equal(input.value, 'Web programmer, a digital plumber.');
    assert.equal(this.person.description, 'Web programmer, a digital plumber.');
  });

  test('can render with different rows, hint and required', async function (assert) {
    buildPerson(this);

    await render(hbs`
      <Form @model={{this.person}} as |form|>
        <form.textarea @attribute="description" @rows="10" @hint="This will show up on your public profile" @required={{true}}/>
      </Form>
    `);

    assert.equal(this.person.description, null);

    const input = this.element.querySelector('textarea[name="person.description"]');

    assert.equal(input.value, '');
    assert.equal(input.placeholder, 'Missing translation: models.person.description');
    assert.equal(input.getAttribute('id'), 'person.description');
    assert.equal(input.required, true);
    assert.equal(input.getAttribute('rows'), '10');
    assert.dom('[data-test-input-label="person.description"]').doesNotExist();
    assert
      .dom('[data-test-input-hint="person.description"]')
      .hasText('This will show up on your public profile');

    await fillIn('[data-test-input="person.description"]', 'Making the world a better place');

    assert.dom('[data-test-input-label="person.description"]').hasText('Missing translation: models.person.description:');
    assert.equal(input.value, 'Making the world a better place');
    assert.equal(this.person.description, 'Making the world a better place');
  });
});

function buildPerson(context) {
  run(() => context.set('person', context.owner.lookup('service:store').createRecord('person')));
}
