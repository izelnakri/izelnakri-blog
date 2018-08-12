import $ from 'jquery';
import Service from '@ember/service';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import generateUUID from '../utils/uuid';
import ENV from 'frontend/config/environment';

export default Service.extend({
  fastboot: service(),
  router: service(),

  runsFakeData: computed(function() {
    const href = this.get('router.location.location.href');

    return ENV['memserver'].enabled && href && !href.startsWith('http://localhost:');
  }),
  maxMobileWidthInPx: 760,
  maxTabletWidthInPx: 768,

  width: null,
  height: null,
  uuid: null,

  init() {
    this._super(...arguments);

    if (this.fastboot.isFastBoot) {
      return run(() => {
        if (/(iPhone|iPod)/g.test(this.userAgent)) {
          this.set('width', this.maxMobileWidthInPx);

          return this.set('height', 480);
        } else if (/(iPad|Android)/g.test(this.userAgent)) {
          this.set('width', this.maxTabletWidthInPx);

          return this.set('height', 1024);
        }

        this.set('width', 1440);
        return this.set('height', 703);
      });
    } else if (this.isMobile) {
      window.FastClick.attach(document.body);
    }

    this.setBrowserUUID();
    this.updateDimensions();

    $(window).on('resize', () => this.updateDimensions());
  },
  setBrowserUUID() {
    const browserData = JSON.parse(window.localStorage.getItem('in-browser')) || {};
    const browserObject = Object.assign(browserData, { uuid: browserData.uuid || generateUUID() });

    this.set('uuid', browserData.uuid);
    window.localStorage.setItem('in-browser', JSON.stringify(browserObject));

    return browserData.uuid;
  },
  willDestroy() {
    return !this.fastboot.isFastBoot ? $(window).off('resize') : null;
  },
  updateDimensions() {
    this.set('width', $(window).width());
    this.set('height', $(window).height());
  },
  userAgent: computed(function() {
    if (this.fastboot.isFastBoot) {
      return this.get('fastboot.request.headers').headers['user-agent'][0];
    }

    return window.navigator.userAgent;
  }),
  isMobile: computed('width', function() {
    return this.width <= this.maxMobileWidthInPx;
  }),
  isTablet: computed('width', function() {
    return this.width > this.maxMobileWidthInPx && this.width <= this.maxTabletWidthInPx;
  }),
  isDesktop: computed('width', function() {
    return this.width > this.maxTabletWidthInPx;
  }),
  isChrome: computed('userAgent', function() {
    return this.userAgent.indexOf('Chrome') !== -1
  }),
  isSafari: computed('userAgent', function() {
    return !this.isChrome && this.userAgent.indexOf('Safari') !== -1;
  }),
  isIOS: computed('userAgent', function() {
    return /(iPad|iPhone|iPod)/g.test(this.userAgent);
  })
});
