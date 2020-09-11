import EmberObject from '@ember/object';
import RSVP from 'rsvp';
import sinon from 'sinon';
import { module, test } from 'qunit';
import { setupTest } from 'frontend/tests/helpers';

// NOTE: test service.currentLocale (it is also probably slow)

module('Unit | Service | Locale', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    window.localStorage.removeItem('in-locale');

    const i18n = this.owner.lookup('service:i18n');

    i18n.locales = ['en', 'nl', 'de'];
  });

  test('it exists', function (assert) {
    const service = this.owner.lookup('service:locale');

    assert.ok(service);
  });

  test('setLocale(locale) sets locale', function (assert) {
    const service = this.owner.lookup('service:locale');
    const i18nService = this.owner.lookup('service:i18n');

    service.setLocale('tr');

    assert.equal(window.localStorage.getItem('in-locale'), 'tr');
    assert.equal(i18nService.locale, 'tr');
  });

  test('getCurrentLocale() gets browser locale when there is nothing else', function (assert) {
    const service = this.owner.lookup('service:locale');

    assert.equal(service.getCurrentLocale(), 'en');
  });

  test('getCurrentLocale() gets cachedLocale when there is no user', function (assert) {
    window.localStorage.setItem('in-locale', 'nl');

    const service = this.owner.lookup('service:locale');

    assert.equal(service.getCurrentLocale(), 'nl');
  });

  test('getCurrentLocale() gets users locale when there is user', function (assert) {
    const session = this.owner.lookup('service:session');

    session.currentUser = EmberObject.create({ locale: 'de' });

    const service = this.owner.lookup('service:locale');

    assert.equal(service.getCurrentLocale(), 'de');
  });

  test('chooseLocale(locale) sets the locale without user when there is no user', function (assert) {
    const service = this.owner.lookup('service:locale');

    assert.notEqual(service.getCurrentLocale(), 'de');

    const setLocale = sinon.spy(service, 'setLocale');

    service.chooseLocale('de');

    assert.ok(setLocale.calledWith('de'), 'chooseLocale sets the right locale');
  });

  test('chooseLocale(locale) sets users locale and tries to save it and then sets the locale', function (assert) {
    assert.expect(3);

    let UserObject = EmberObject.extend();

    UserObject.reopen({
      locale: 'en',
      save() {
        assert.ok(true, 'save gets called');

        return new RSVP.Promise((resolve) => resolve(UserObject.create({ locale: 'de' })));
      },
    });

    const session = this.owner.lookup('service:session');

    session.currentUser = UserObject.create();

    const service = this.owner.lookup('service:locale');

    assert.equal(service.getCurrentLocale(), 'en');

    service.chooseLocale('de');

    assert.equal(service.getCurrentLocale(), 'de');
  });

  test('changing user changes the currentLocale of locale service', function (assert) {
    let User = EmberObject.extend({ locale: 'en' });
    let currentUser = User.create();

    const session = this.owner.lookup('service:session');

    session.currentUser = currentUser;

    const service = this.owner.lookup('service:locale');

    assert.equal(service.getCurrentLocale(), 'en');

    currentUser.locale = 'de';

    assert.equal(service.getCurrentLocale(), 'de');
  });
});
