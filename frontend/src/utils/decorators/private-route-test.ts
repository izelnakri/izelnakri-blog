// @ts-nocheck
/* eslint-disable no-use-before-define */
import sinon from 'sinon';
import Route from '@ember/routing/route';
import EmberObject from '@ember/object';
import PrivateRoute from './private-route';
import { module, test } from 'qunit';
import { setupTest } from 'frontend/tests/helpers';

module('Utils | Decorators | private-route', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    const subject =
      @PrivateRoute
      class extends Route {};

    assert.ok(subject);
  });

  test('it redirects if not authenticated', function(assert) {
    const owner = this.owner;
    const TargetRoute =
      @PrivateRoute
      class extends Route {
        session = owner.lookup('service:session');
        flashMessages = owner.lookup('service:flash-messages');
      };
    const subject = TargetRoute.create();
    const transition = { some: 'transition' };

    subject.replaceWith = sinon.stub();
    subject.beforeModel(transition);

    assert.ok(subject.replaceWith.calledOnce);
    assert.ok(subject.replaceWith.calledWithExactly('login'));
    assert.equal(subject.get('session.previousRouteTransition'), transition);
  });

  test('it does not redirect if auth', function(assert) {
    const owner = this.owner;
    const TargetRoute =
      @PrivateRoute
      class extends Route {
        session = owner.lookup('service:session');
        flashMessages = owner.lookup('service:flash-messages');
      };
    const subject = TargetRoute.create();

    subject.replaceWith = sinon.stub();
    subject.set('session.currentUser', EmberObject.create({}));
    subject.beforeModel({ some: 'transition' });

    assert.notOk(subject.replaceWith.called);
    assert.equal(subject.get('session.previousRouteTransition'), null);
  });
});
