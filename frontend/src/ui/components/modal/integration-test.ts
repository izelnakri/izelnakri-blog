import { module, test } from 'qunit';
import { click, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'frontend/tests/helpers';

module('Integration | Component | <Modal/>', function (hooks) {
  setupRenderingTest(hooks);

  test('visitor can see the modal and closes successfully', async function (assert) {
    assert.expect(9);

    await render(hbs`
      <Modal @title="something">
        <div class="custom-div">
          <p>Some random text</p>
        </div>
      </Modal>
    `);

    const modal = this.element.querySelector('.modal');

    assert.notEqual(modal.getAttribute('style'), 'display: none;');
    assert.equal(
      this.element.querySelector('.modal-dialog').getAttribute('class'),
      'modal-dialog '
    );

    assert.equal(this.element.querySelectorAll('.modal-header').length, 1);
    assert.equal(this.element.querySelector('.modal-header .modal-title').textContent, 'something');
    assert.equal(
      this.element.querySelectorAll('.modal-header button.close .fas.fa-lg.fa-times').length,
      1
    );

    assert.equal(
      this.element.querySelector('.modal-content').getAttribute('class'),
      'modal-content'
    );
    assert.equal(
      this.element.querySelector('.modal-content .custom-div p').textContent,
      'Some random text'
    );

    assert.equal(this.element.querySelectorAll('.modal-content .modal-footer').length, 0);

    await click('.modal-header button.close');

    assert.equal(modal.getAttribute('style'), 'display: none;');
  });

  test('visitor can see the modal with title and footer', async function (assert) {
    assert.expect(7);

    await render(hbs`
      <Modal @title="GUTS Tickets">
        <div class="modal-body">
          <p id="something">another text</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </Modal>
    `);

    const modal = this.element.querySelector('.modal');

    assert.notEqual(modal.getAttribute('style'), 'display: none;');
    assert.equal(
      this.element.querySelector('.modal-header .modal-title').textContent,
      'GUTS Tickets'
    );

    assert.equal(
      this.element.querySelectorAll('.modal-header button.close .fas.fa-lg.fa-times').length,
      1
    );
    assert.equal(
      this.element.querySelector('.modal-content .modal-body #something').textContent,
      'another text'
    );

    assert.equal(
      this.element.querySelector('.modal-content .modal-footer .btn.btn-primary').textContent,
      'Save changes'
    );

    await click('.modal-content .modal-footer .btn.btn-primary');

    assert.notEqual(modal.getAttribute('style'), 'display: none;');

    await click('.modal-header button.close');

    assert.equal(modal.getAttribute('style'), 'display: none;');
  });

  test('visitor can see a big and small modals', async function (assert) {
    assert.expect(8);

    await render(hbs`
      <Modal @title="Our awesome modal" @size="sm">
        <span>Wubba Lubba Dub-Dub</span>
      </Modal>
    `);

    assert.notEqual(this.element.querySelector('.modal').getAttribute('style'), 'display: none;');
    assert.equal(
      this.element.querySelector('.modal-dialog').getAttribute('class'),
      'modal-dialog modal-sm'
    );

    assert.equal(
      this.element.querySelector('.modal-header .modal-title').textContent,
      'Our awesome modal'
    );
    assert.equal(
      this.element.querySelector('.modal-content span').textContent,
      'Wubba Lubba Dub-Dub'
    );

    await render(hbs`
      <Modal @title="Planet music" @size="lg">
        <span>SHOW ME WHAT YOU GOT!</span>
      </Modal>
    `);

    assert.notEqual(this.element.querySelector('.modal').getAttribute('style'), 'display: none;');
    assert.equal(
      this.element.querySelector('.modal-dialog').getAttribute('class'),
      'modal-dialog modal-lg'
    );

    assert.equal(
      this.element.querySelector('.modal-header .modal-title').textContent,
      'Planet music'
    );
    assert.equal(
      this.element.querySelector('.modal-content span').textContent,
      'SHOW ME WHAT YOU GOT!'
    );
  });

  test('visitor can see a modal without a header and can close it', async function (assert) {
    assert.expect(4);

    await render(hbs`
      <Modal @header={{false}}>
        <h1>DISQUALIFIED!</h1>
      </Modal>
    `);

    const modal = this.element.querySelector('.modal');

    assert.notEqual(modal.getAttribute('style'), 'display: none;');
    assert.equal(this.element.querySelectorAll('.modal-header').length, 0);
    assert.equal(this.element.querySelector('.modal-content h1').textContent, 'DISQUALIFIED!');

    await click('.modal');

    assert.equal(modal.getAttribute('style'), 'display: none;');
  });

  test('ml-modal onShow triggers correctly', async function (assert) {
    assert.expect(3);

    this.set('showAction', () => assert.ok(true, 'showActions work'));
    this.set('closeAction', () => assert.ok(true, 'closeActions work'));

    await render(hbs`
      <Modal @onShow={{this.showAction}}>
        <h1>SHOW ME WHAT YOU GOT!</h1>
      </Modal>
    `);

    const modal = this.element.querySelector('.modal');

    assert.notEqual(modal.getAttribute('style'), 'display: none;');

    await click('.modal');

    assert.equal(modal.getAttribute('style'), 'display: none;');
  });

  test('ml-modal onClose triggets correctly', async function (assert) {
    assert.expect(6);

    this.set('showAction', () => assert.ok(true, 'showActions work'));
    this.set('closeAction', () => assert.ok(true, 'closeActions work'));

    await render(hbs`
      <Modal @title="Title" @onClose={{this.closeAction}}>
        <h1>GOOD JOB!</h1>
      </Modal>
    `);

    const modal = this.element.querySelector('.modal');

    assert.notEqual(modal.getAttribute('style'), 'display: none;');

    await click('.modal-header button.close');

    assert.equal(modal.getAttribute('style'), 'display: none;');

    await render(hbs`
      <Modal @title="Title" @onClose={{this.closeAction}}>
        <h1>GOOD JOB!</h1>
      </Modal>
    `);

    assert.notEqual(this.element.querySelector('.modal').getAttribute('style'), 'display: none;');

    await click('.modal');

    assert.equal(this.element.querySelector('.modal').getAttribute('style'), 'display: none;');
  });
});
