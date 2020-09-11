import {
  setupApplicationTest as upstreamSetupApplicationTest,
  setupRenderingTest as upstreamSetupRenderingTest,
  setupTest as upstreamSetupTest,
} from 'ember-qunit';

let setupTest = function (hooks) {
  hooks.beforeEach(function () {
    clearBrowser();

    window.DISABLE_MEMSERVER = true;
  });

  upstreamSetupTest(hooks);
};

let setupRenderingTest = function (hooks) {
  hooks.beforeEach(function () {
    clearBrowser();

    window.DISABLE_MEMSERVER = true;
  });

  upstreamSetupRenderingTest(hooks);
};

let setupApplicationTest = function (hooks) {
  hooks.beforeEach(function () {
    clearBrowser();

    window.DISABLE_MEMSERVER = false;
    // this.owner.lookup('service:modals').close();
  });

  upstreamSetupApplicationTest(hooks);

  hooks.afterEach(function () {
    window.MemServer.shutdown();

    this.owner.lookup('service:modals').close();
  });
};

export { setupApplicationTest, setupRenderingTest, setupTest };

function clearBrowser() {
  document.querySelector('body').scrollTop = 0;
  document.cookie.split(';').forEach((cookie) => {
    document.cookie = cookie
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });
  window.localStorage.clear();
}
