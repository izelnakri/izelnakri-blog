import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'frontend/tests/helpers';

module('Integration | Component | in-form', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Form />`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      <Form>
        template block text
      </Form>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});

// import { module, test } from 'qunit';
// import { click, fillIn, render } from '@ember/test-helpers';
// import { run } from '@ember/runloop';
// import hbs from 'htmlbars-inline-precompile';
// import Response from 'memserver/response';
// import Memserver from 'memserver/server';
// import initializer from 'frontend/memserver/initializer';
// import routes from 'frontend/memserver/routes';
// import Person from 'frontend/memserver/models/person';
// import Session from 'frontend/memserver/models/session';
// import User from 'frontend/memserver/models/user';
// import { setupRenderingTest } from 'frontend/tests/helpers';
// import Service from '@ember/service';

// module('Integration | Component | <Form/>', function(hooks) {
//   hooks.beforeEach(function() {
//     this.Server = new Memserver({ initializer, routes });
//   });

//   setupRenderingTest(hooks);

//   hooks.afterEach(function() {
//     this.Server.shutdown();
//   });

//   test('form component renders and can create a model successfully when hit submit', async function(assert) {
//     assert.expect(7);

//     buildAUser(this);

//     await render(hbs`
//       <Form @model={{this.user}} as |form|>
//         <form.input @attribute="username"/>
//         <form.password @attribute="password"/>

//         <form.button/>
//       </Form>
//     `);

//     this.owner.register(
//       'service:flash-messages',
//       class FlashMessage extends Service {
//         success(text) {
//           assert.equal(text.toString(), 'Missing translation: models.user.saved');
//         }
//       }
//     );

//     this.Server.post('/users', ({ params }) => {
//       assert.equal(params.user.password, '123456');

//       const user = User.insert({ username: params.user.username, password: params.user.password });

//       return {
//         user: Object.assign(User.serializer(user), {
//           currentSession: Session.serializer(Session.insert({ user_id: user.id }))
//         })
//       };
//     });

//     const usernameInput = this.element.querySelector('input[name="user.username"]');

//     assert.equal(this.element.querySelectorAll('.ml-form').length, 1);
//     assert.equal(usernameInput.value, 'izelnakri');

//     await fillIn('input[name="user.password"]', '123456');
//     await click('button[type="submit"]');

//     assert.equal(usernameInput.value, 'izelnakri');
//     assert.equal(this.user.username, 'izelnakri');
//     assert.equal(this.user.password, '123456');
//   });

//   test('form component renders and can show creations errors successfully for a model', async function(assert) {
//     assert.expect(12);

//     buildAUser(this);

//     this.user.username = 'izel-nakri';

//     await render(hbs`
//       <Form @model={{this.user}} as |form|>
//         <form.input @attribute="username"/>
//         <form.password @attribute="password"/>

//         <button type="submit"></button>
//       </Form>
//     `);

//     const usernameInput = this.element.querySelector('input[name="user.username"]');
//     const passwordInput = this.element.querySelector('input[name="user.password"]');

//     assert.equal(usernameInput.value, 'izel-nakri');
//     assert.equal(passwordInput.value, '');

//     await fillIn('input[name="user.password"]', '12');

//     assert.equal(this.element.querySelector('label[for="user.password"]').textContent, 'Password:');
//     assert.equal(passwordInput.value, '12');

//     this.owner.register(
//       'service:flash-messages',
//       class FlashMessage extends Service {
//         danger(text) {
//           assert.equal(text.toString(), 'Error occured while saving this record');
//         }
//       }
//     );

//     this.Server.post('/users', () => Response(422, { errors: { password: ['is too short'] } }));

//     await click('button[type="submit"]');

//     assert.equal(this.get('user.errors.firstObject.attribute'), 'password');
//     assert.equal(this.get('user.errors.firstObject.message'), 'is too short');

//     assert.equal(usernameInput.value, 'izel-nakri');
//     assert.equal(passwordInput.value, '12');
//     assert.equal(this.user.username, 'izel-nakri');
//     assert.equal(this.user.password, '12');
//     assert.equal(
//       this.element.querySelector('label[for="user.password"]').textContent,
//       'Password is too short:'
//     );
//   });

//   test('form component can render its children components and send `update`s with right flash messages', async function(assert) {
//     assert.expect(19);

//     buildAlreadyCreatedPerson(this);

//     this.owner.register(
//       'service:flash-messages',
//       class FlashMessage extends Service {
//         danger(text) {
//           assert.equal(text.toString(), 'Error occured while saving this record');
//         }

//         success(text) {
//           assert.equal(text.toString(), 'Person is successfully saved');
//         }
//       }
//     );

//     await render(hbs`
//       <Form @model={{this.person}} as |form|>
//         <form.input @attribute="firstName"/>
//         <form.input @attribute="lastName"/>

//         <button type="submit"></button>
//       </Form>
//     `);

//     this.Server.put('/people/:id', () =>
//       Response(422, { errors: { last_name: ['is too short'] } })
//     );

//     const firstNameInput = this.element.querySelector('input[name="person.first_name"]');
//     const lastNameLabel = this.element.querySelector('label[for="person.last_name"]');
//     const lastNameInput = this.element.querySelector('input[name="person.last_name"]');

//     assert.equal(firstNameInput.value, 'Izel');
//     assert.equal(lastNameLabel.textContent, 'Last name:');

//     await fillIn('input[name="person.last_name"]', 'A');
//     await click('button[type="submit"]');

//     assert.equal(this.get('person.errors.firstObject.attribute'), 'lastName');
//     assert.equal(this.get('person.errors.firstObject.message'), 'is too short');

//     assert.equal(this.person.firstName, 'Izel');
//     assert.equal(firstNameInput.value, 'Izel');
//     assert.equal(this.person.lastName, 'A');
//     assert.equal(lastNameInput.value, 'A');
//     assert.equal(
//       this.element.querySelector('label[for="person.last_name"]').textContent,
//       'Last name is too short:'
//     );

//     await fillIn('input[name="person.last_name"]', 'Anexamplelastname');

//     assert.equal(lastNameLabel.textContent, 'Last name:');

//     this.Server.put('/people/:id', ({ params }) => {
//       assert.equal(params.person.first_name, 'Izel');
//       assert.equal(params.person.last_name, 'Anexamplelastname');

//       return { person: Person.serializer(Person.update(params.person)) };
//     });

//     await click('button[type="submit"]');

//     assert.equal(this.person.firstName, 'Izel');
//     assert.equal(firstNameInput.value, 'Izel');
//     assert.equal(this.person.lastName, 'Anexamplelastname');
//     assert.equal(lastNameInput.value, 'Anexamplelastname');
//     assert.equal(lastNameLabel.textContent, 'Last name:');
//   });

//   test('form component beforeSubmit, afterSubmit and onSuccess and onError works', async function(assert) {
//     assert.expect(4);

//     buildAlreadyCreatedPerson(this);

//     this.beforeSubmitHandler = (model) => {
//       assert.deepEqual(model, this.person, 'submitted model gets passed to beforeSubmit');
//     };

//     await render(hbs`
//       <Form @model={{this.person}} @beforeSubmit={{action this.beforeSubmitHandler}} as |form|>
//         <form.input @attribute="firstName"/>

//         <button type="submit"></button>
//       </Form>
//     `);

//     await fillIn('input[name="person.first_name"]', 'A');

//     this.Server.put('/people/:id', () =>
//       Response(422, { errors: { first_name: ['is too short'] } })
//     );

//     await click('button[type="submit"]');

//     this.onErrorHandler = (model) => {
//       assert.deepEqual(model, this.person, 'submitted model gets passed to onErrorHandler');
//     };

//     await render(hbs`
//       <Form @model={{this.person}} @onError={{action this.onErrorHandler}} as |form|>
//         <form.input @attribute="firstName"/>

//         <button type="submit"></button>
//       </Form>
//     `);

//     await click('button[type="submit"]');

//     this.afterSubmitHandler = (model) => {
//       assert.deepEqual(model, this.person, 'model gets passed to afterSubmitHandler');
//     };

//     await render(hbs`
//       <Form @model={{this.person}} @afterSubmit={{action this.afterSubmitHandler}} as |form|>
//         <form.input @attribute="firstName"/>

//         <button type="submit"></button>
//       </Form>
//     `);

//     await click('button[type="submit"]');

//     this.onSuccessHandler = (model) => {
//       assert.deepEqual(model, this.person, 'submitted model gets passed to onSuccessHandler');
//     };

//     await render(hbs`
//       <Form @model={{this.person}} @onSuccess={{action this.onSuccessHandler}} as |form|>
//         <form.input @attribute="firstName"/>

//         <button type="submit"></button>
//       </Form>
//     `);

//     this.Server.put('/people/:id', ({ params }) => {
//       delete params.person.phone_numbers;
//       delete params.person.emails;

//       const personParams = Object.assign(params.person, { id: params.id });

//       return { person: Person.serializer(Person.update(personParams)) };
//     });

//     await click('button[type="submit"]');
//   });
// });

// function buildAUser(context) {
//   run(() => (context.user = context.owner.lookup('service:store').createRecord('user')));

//   context.user.username = 'izelnakri';
// }

// function buildAlreadyCreatedPerson(context) {
//   run(() => {
//     const store = context.owner.lookup('service:store');

//     store.pushPayload({
//       people: [
//         {
//           id: 1,
//           first_name: 'Izel',
//           last_name: 'Nakri',
//           emails: [],
//           phoneNumbers: []
//         }
//       ]
//     });

//     context.person = store.peekRecord('person', 1);
//   });
// }
