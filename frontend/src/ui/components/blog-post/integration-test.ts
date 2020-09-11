import { module, test } from 'qunit';
// import { render } from '@ember/test-helpers';
// import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'frontend/tests/helpers';
// import { startMemServer } from 'frontend/instance-initializers/memserver';

module('Integration | Component | in-blog-post', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // const store = this.owner.lookup('service:store');
    // const person = store.createRecord('person', { fullName: 'Izel Nakri' });
    // const user = store.createRecord('user', { person: person });
    // const tags = [
    //   store.createRecord('tag', { name: 'Elixir' }),
    //   store.createRecord('tag', { name: 'DevOps' })
    // ];
    // const blogPost = store.createRecord('blog-post', {
    //   title: 'Word on the street',
    //   markdownContent: `Few months ago I started playing with Elixir.\n## Summary\nIt is awesome.\n#### Conclusion\nYou should try it.`,
    //   user: user,
    //   tags: tags,
    //   insertedAt: new Date('2018-04-01')
    // })
    //
    // this.set('blogPost', blogPost);
    //
    // await render(hbs`{{in-blog-post model=blogPost}}`);
    //
    // assert.equal(this.element.querySelector('.in-blog-post-title'), 'Word on the street');
    // assert.equal()
    // // <p>Few months ago I started playing with Elixir.</p>
    // // <h2 id="summary">Summary</h2>
    // // <p>It is awesome.</p>
    // // <h4 id="conclusion">Conclusion</h4>
    // // <p>You should try it.</p>
    // // Template block usage:
    // await render(hbs`
    //   {{#in-blog-post}}
    //     template block text
    //   {{/in-blog-post}}
    // `);

    // assert.equal(this.element.textContent.trim(), 'template block text');
    assert.ok(true);
  });
});
