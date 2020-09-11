import { module, test } from 'qunit';
import { blur, click, fillIn, render } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'frontend/tests/helpers';

// TODO: onInput + backend integration
module('Integration | Component | <Form::Input/>', function (hooks) {
  setupRenderingTest(hooks);

  test('test default input', async function (assert) {
    assert.expect(11);

    buildModel(this, 'email');

    await render(hbs`
      <Form @model={{this.email}} as |form|>
        <form.input @attribute="address"/>
      </Form>
    `);

    const input = this.element.querySelector('input[name="email.address"]');

    assert.equal(input.value, '');
    assert.equal(input.placeholder, 'Email address');
    assert.equal(input.getAttribute('id'), 'email.address');
    assert.equal(input.type, 'text');
    assert.equal(input.required, false);
    assert.equal(input.autofocus, false);

    await fillIn('input[name="email.address"]', 'Get Schwifty');

    assert.equal(this.element.querySelector('label[for="email.address"]').textContent, 'Email address:');
    assert.equal(input.value, 'Get Schwifty');
    assert.equal(this.email.address, 'Get Schwifty');

    await fillIn('input[name="email.address"]', 'Sziget Festival');

    assert.equal(input.value, 'Sziget Festival');
    assert.equal(this.email.address, 'Sziget Festival');
  });

  test('input can have a specific value, placeholder and can be required', async function (assert) {
    assert.expect(12);

    buildModel(this, 'user');

    this.user.email = 'contact@izelnakri.com';

    await render(hbs`
      <Form @model={{this.user}} as |form|>
        <form.input @type="email" @attribute="email" @placeholder="Email here" @required={{true}} @autofocus={{true}}/>
      </Form>
    `);

    const input = this.element.querySelector('input[name="user.email"]');
    const label = this.element.querySelector('label[for="user.email"]');

    assert.equal(label.textContent, 'Missing translation: models.user.email:');
    assert.equal(input.value, 'contact@izelnakri.com');
    assert.equal(input.getAttribute('id'), 'user.email');
    assert.equal(input.type, 'email');
    assert.equal(input.required, true);
    assert.equal(input.autofocus, true);

    await fillIn('input[name="user.email"]', '');
    await blur('input[name="user.email"]');

    assert.equal(input.value, '');
    assert.equal(input.placeholder, 'Email here');

    await fillIn('input[name="user.email"]', 'izel@guts.tickets');

    assert.equal(input.value, 'izel@guts.tickets');
    assert.equal(this.user.email, 'izel@guts.tickets');

    await fillIn('input[name="user.email"]', 'izelnakri@hotmail.com');

    assert.equal(input.value, 'izelnakri@hotmail.com');
    assert.equal(this.user.email, 'izelnakri@hotmail.com');
  });

  test('input can have a hint', async function (assert) {
    assert.expect(8);

    buildModel(this, 'email');

    this.email.address = 'jochem-myjer';

    await render(hbs`
      <Form @model={{this.email}} as |form|>
        <form.input @attribute="address" @placeholder="Put your permalink here, ex. sp500-broke-new-record"
          @required={{true}} @hint="This is a link to your email, no spaces allowed"/>
      </Form>
    `);

    const input = this.element.querySelector('input[name="email.address"]');
    const label = this.element.querySelector('label[for="email.address"]');
    const hint = this.element.querySelector('p.text-muted');

    assert.equal(label.textContent, 'Email address:');
    assert.equal(input.value, 'jochem-myjer');
    assert.equal(input.placeholder, 'Put your permalink here, ex. sp500-broke-new-record');
    assert.equal(input.getAttribute('id'), 'email.address');
    assert.equal(input.type, 'text');
    assert.equal(input.required, true);
    assert.equal(input.autofocus, false);
    assert.equal(hint.textContent, 'This is a link to your email, no spaces allowed');
  });

  test('test addonLeft', async function (assert) {
    assert.expect(4);

    buildModel(this, 'email');

    await render(hbs`
      <Form @model={{this.email}} as |form|>
        <form.input @attribute="address" @addonLeft="http://guts.tickets/"/>
      </Form>
    `);

    const inputAddon = this.element.querySelector('input[name="email.address"]')
      .previousElementSibling;
    const input = this.element.querySelector('input[name="email.address"]');

    assert.equal(inputAddon.getAttribute('class'), 'input-group-btn');
    assert.equal(inputAddon.querySelector('button').textContent.trim(), 'http://guts.tickets/');
    assert.notEqual(document.activeElement, input);

    await click('.input-group-btn button');

    assert.equal(document.activeElement, input);
  });

  test('test inputAddonLeftIcon', async function (assert) {
    assert.expect(4);

    buildModel(this, 'email');

    await render(hbs`
      <Form @model={{this.email}} as |form|>
        <form.input @attribute="address" @addonLeft="fas-globe"/>
      </Form>
    `);

    const inputAddon = this.element.querySelector('input[name="email.address"]')
      .previousElementSibling;
    const input = this.element.querySelector('input[name="email.address"]');
    const button = inputAddon.querySelector('button');

    assert.equal(inputAddon.getAttribute('class'), 'input-group-btn');
    assert.equal(button.querySelectorAll('.fa-globe').length, 1);
    assert.notEqual(document.activeElement, input);

    await click('.input-group-btn button');

    assert.equal(document.activeElement, input);
  });

  test('test inputAddonRight', async function (assert) {
    assert.expect(4);

    buildModel(this, 'email');

    await render(hbs`
      <Form @model={{this.email}} as |form|>
        <form.input @attribute="address" @addonRight="Remove"/>
      </Form>
    `);

    const inputAddon = this.element.querySelector('input[name="email.address"]').nextElementSibling;
    const input = this.element.querySelector('input[name="email.address"]');
    const button = inputAddon.querySelector('button');

    assert.equal(inputAddon.getAttribute('class'), 'input-group-btn');
    assert.equal(button.textContent.trim(), 'Remove');
    assert.notEqual(document.activeElement, input);

    await click('.input-group-btn button');

    assert.equal(document.activeElement, input);
  });

  test('test inputAddonRightIcon', async function (assert) {
    assert.expect(4);

    buildModel(this, 'email');

    await render(hbs`
      <Form @model={{this.email}} as |form|>
        <form.input @attribute="address" @addonRight="fas-times"/>
      </Form>
    `);

    const inputAddon = this.element.querySelector('input[name="email.address"]').nextElementSibling;
    const input = this.element.querySelector('input[name="email.address"]');
    const button = inputAddon.querySelector('button');

    assert.equal(inputAddon.getAttribute('class'), 'input-group-btn');
    assert.equal(button.querySelectorAll('.fa-times').length, 1);
    assert.notEqual(document.activeElement, input);

    await click('.input-group-btn button');

    assert.equal(document.activeElement, input);
  });

  test('inputAddonLeft/inputAddonRight and icon combination works', async function (assert) {
    assert.expect(7);

    buildModel(this, 'email');

    await render(hbs`
      <Form @model={{this.email}} as |form|>
        <form.input @attribute="address" @addonLeft="https://guts.tickets/" @addonRight="fas-times"/>
      </Form>
    `);

    const inputAddonLeft = this.element.querySelector('input[name="email.address"]')
      .previousElementSibling;
    const inputAddonLeftButton = inputAddonLeft.querySelector('button');
    const input = this.element.querySelector('input[name="email.address"]');
    const inputAddonRight = this.element.querySelector('input[name="email.address"]')
      .nextElementSibling;
    const inputAddonRightButton = inputAddonRight.querySelector('button');

    assert.equal(inputAddonLeft.getAttribute('class'), 'input-group-btn');
    assert.equal(
      inputAddonLeft.querySelector('button').textContent.trim(),
      'https://guts.tickets/'
    );
    assert.equal(inputAddonRight.getAttribute('class'), 'input-group-btn');
    assert.equal(inputAddonRightButton.querySelectorAll('.fa-times').length, 1);

    assert.notEqual(document.activeElement, input);

    await click(inputAddonLeftButton);

    assert.equal(document.activeElement, input);

    await click(inputAddonLeftButton);

    assert.equal(document.activeElement, input);
  });

  test('onAddonClick works for left addon and right addon', async function (assert) {
    assert.expect(9);

    buildModel(this, 'email');

    this.testClick = () => assert.ok(true, 'onAddonClick works');

    await render(hbs`
      <Form @model={{this.email}} as |form|>
        <form.input @attribute="address" @addonLeft="www." @onAddonClick={{action this.testClick}}/>
      </Form>
    `);

    const input = this.element.querySelector('input[name="email.address"]');

    assert.notEqual(document.activeElement, input);

    await click('.input-group-btn button');

    assert.equal(document.activeElement, input);

    await render(hbs`
      <Form @model={{this.email}} as |form|>
        <form.input @attribute="address" @addonLeft="fas-globe" @onAddonClick={{action this.testClick}}/>
      </Form>
    `);
    await click('.input-group-btn .fa-globe');

    assert.equal(document.activeElement, this.element.querySelector('input[name="email.address"]'));

    await render(hbs`
      <Form @model={{this.email}} as |form|>
        <form.input @attribute="address" @addonRight="Close" @onAddonClick={{action this.testClick}}/>
      </Form>
    `);
    await click('.input-group-btn button');

    assert.equal(document.activeElement, this.element.querySelector('input[name="email.address"]'));

    await render(hbs`
      <Form @model={{this.email}} as |form|>
        <form.input @attribute="address" @addonRight="fas-times" @onAddonClick={{action this.testClick}}/>
      </Form>
    `);
    await click('.input-group-btn .fa-times');

    assert.equal(document.activeElement, this.element.querySelector('input[name="email.address"]'));
  });
});

function buildModel(context, modelName) {
  run(() => (context[modelName] = context.owner.lookup('service:store').createRecord(modelName)));
}
