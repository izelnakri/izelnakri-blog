import $ from 'jquery';
import { module, test } from 'qunit';
import { setupTest } from 'frontend/tests/helpers';

// NOTE: maybe set do isChrome, isSafari, isIOS in future and runsFakeData

module('Unit | Service | Browser', function (hooks) {
  const PREDEFINED_UUID = 'ad411990-9ec4-4af2-86ae-d07d0966566f';

  setupTest(hooks);

  hooks.beforeEach(function () {
    window.localStorage.removeItem('ml-browser');
  });

  test('it exists', function (assert) {
    const service = this.owner.lookup('service:browser');

    assert.ok(service);
  });

  test('browser generates and caches browser.uuid on init', function (assert) {
    const service = this.owner.lookup('service:browser');
    const firstUUID = service.uuid;

    assert.equal(firstUUID.length, 36);
    assert.notEqual(firstUUID, PREDEFINED_UUID);
    assert.equal(JSON.parse(window.localStorage.getItem('ml-browser')).uuid, firstUUID);
  });

  test('browser start from cached uuid on init when there is a cache', function (assert) {
    window.localStorage.setItem('ml-browser', JSON.stringify({ uuid: PREDEFINED_UUID }));

    const service = this.owner.lookup('service:browser');

    assert.equal(service.uuid, PREDEFINED_UUID);
    assert.equal(JSON.parse(window.localStorage.getItem('ml-browser')).uuid, service.uuid);
  });

  test('browser sets the right browser width and height on init', function (assert) {
    const service = this.owner.lookup('service:browser');

    assert.ok(0 < service.width);
    assert.ok(service.width <= $(window).width());
    assert.ok(0 < service.height);
    assert.ok(service.height <= $(window).height());
    assert.ok(service.width > service.height);
  });

  test('browser sets the right browser variables on init', function (assert) {
    const service = this.owner.lookup('service:browser');

    assert.equal(service.userAgent, window.navigator.userAgent);
    // assert.equal(service.isChrome, true);
    // assert.equal(service.isIOS, false); // window.navigator.userAgent changes!
  });

  test('browser device type changes based on width of the device', function (assert) {
    const service = this.owner.lookup('service:browser');

    service.width = 1024;

    assert.equal(service.isDesktop, true);
    assert.equal(service.isTablet, false);
    assert.equal(service.isMobile, false);

    service.width = 760;

    assert.equal(service.isDesktop, false);
    assert.equal(service.isTablet, false);
    assert.equal(service.isMobile, true);

    service.width = 768;

    assert.equal(service.isDesktop, false);
    assert.equal(service.isTablet, true);
    assert.equal(service.isMobile, false);

    service.width = 1024;

    assert.equal(service.isDesktop, true);
    assert.equal(service.isTablet, false);
    assert.equal(service.isMobile, false);
  });
});
