import { module, test } from 'qunit';
import { blur, click, fillIn, render } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'frontend/tests/helpers';

module('Integration | Component | <Form::Password/>', function (hooks) {
  setupRenderingTest(hooks);

  test('test default input', async function (assert) {
    assert.expect(11);

    run(() => (this.user = this.owner.lookup('service:store').createRecord('user')));

    await render(hbs`
      <Form @model={{this.user}} as |form|>
        <form.password @attribute="password"/>
      </Form>
    `);

    const input = this.element.querySelector('input[name="user.password"]');

    assert.equal(input.value, '');
    assert.equal(input.placeholder, 'Enter your password');
    assert.equal(input.getAttribute('id'), 'user.password');
    assert.equal(input.type, 'password');
    assert.equal(input.required, true);
    assert.equal(input.autofocus, false);

    await fillIn('input[name="user.password"]', 'somepassword12345');

    assert.equal(this.element.querySelector('label[for="user.password"]').textContent, 'Password:');
    assert.equal(input.value, 'somepassword12345');
    assert.equal(this.user.password, 'somepassword12345');

    await fillIn('input[name="user.password"]', 'newpassword');

    assert.equal(input.value, 'newpassword');
    assert.equal(this.user.password, 'newpassword');
  });

  test('input can have a specific value, autofocus and can be required=false', async function (assert) {
    assert.expect(6);

    run(() => (this.user = this.owner.lookup('service:store').createRecord('user')));

    this.user.password = 'alabama';

    await render(hbs`
      <Form @model={{this.user}} as |form|>
        <form.password @attribute="password" @required={{false}} @autofocus={{true}}/>
      </Form>
    `);

    const input = this.element.querySelector('input[name="user.password"]');

    assert.equal(input.value, 'alabama');
    assert.equal(input.getAttribute('id'), 'user.password');
    assert.equal(input.type, 'password');
    assert.equal(input.required, false);
    assert.equal(input.autofocus, true);

    await fillIn('input[name="user.password"]', '');
    await blur('input[name="user.password"]');

    assert.equal(input.placeholder, 'Enter your password');
  });

  test('addonLeft and addon right works', async function (assert) {
    assert.expect(25);

    run(() => (this.user = this.owner.lookup('service:store').createRecord('user')));

    this.user.password = 'somepassword';

    await render(hbs`
      <Form @model={{this.user}} as |form|>
        <form.password @attribute="password"/>
      </Form>
    `);

    const input = this.element.querySelector('input[name="user.password"]');
    const getInput = () => this.element.querySelector('input[name="user.password"]');
    const inputAddonLeft = input.previousElementSibling;
    const inputAddonLeftButton = inputAddonLeft.querySelector('button');
    const getInputAddonRight = () => {
      return getInput().nextElementSibling;
    };
    const getInputAddonRightButton = () => getInputAddonRight().querySelector('button');

    assert.equal(input.value, 'somepassword');
    assert.equal(input.type, 'password');
    assert.notEqual(document.activeElement, input);

    assert.equal(inputAddonLeft.getAttribute('class'), 'input-group-btn');
    assert.equal(inputAddonLeftButton.querySelectorAll('.fa-lock').length, 1);
    assert.equal(getInputAddonRight().getAttribute('class'), 'input-group-btn');
    assert.equal(getInputAddonRightButton().querySelectorAll('.fa-eye').length, 1);
    assert.equal(getInputAddonRightButton().querySelectorAll('.fa-eye-slash').length, 0);

    await click(inputAddonLeftButton);

    assert.equal(document.activeElement, input);

    await click(getInputAddonRightButton());

    assert.equal(getInput().value, 'somepassword');
    assert.equal(getInput().type, 'text');
    assert.equal(getInputAddonRightButton().querySelectorAll('.fa-eye').length, 0);
    assert.equal(getInputAddonRightButton().querySelectorAll('.fa-eye-slash').length, 1);

    await fillIn('input[name="user.password"]', 'somepassword12345');

    assert.equal(getInput().value, 'somepassword12345');
    assert.equal(this.user.password, 'somepassword12345');

    await fillIn('input[name="user.password"]', 'newpassword');

    assert.equal(getInput().value, 'newpassword');
    assert.equal(this.user.password, 'newpassword');

    await click(getInputAddonRightButton());

    assert.equal(getInput().value, 'newpassword');
    assert.equal(getInput().type, 'password');
    assert.equal(getInputAddonRightButton().querySelectorAll('.fa-eye').length, 1);
    assert.equal(getInputAddonRightButton().querySelectorAll('.fa-eye-slash').length, 0);

    await fillIn('input[name="user.password"]', 'somepassword12345');

    assert.equal(getInput().value, 'somepassword12345');
    assert.equal(this.user.password, 'somepassword12345');

    await fillIn('input[name="user.password"]', 'newpassword');

    assert.equal(getInput().value, 'newpassword');
    assert.equal(this.user.password, 'newpassword');
  });
});
