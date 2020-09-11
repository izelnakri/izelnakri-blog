import Service from '@ember/service';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import generateUUID from '../utils/uuid';
import ENV from 'frontend/config/environment';

export default class BrowserService extends Service {
  @service fastboot;
  @service router;
  @tracked width;

  maxMobileWidthInPx = 760;
  maxTabletWidthInPx = 768;
  runsFakeData = false;
  height = null;
  uuid = null;
  userAgent = null;
  viewsDocumentation = false;
  updateAfterResize = null;

  constructor() {
    super(...arguments);

    if (this.fastboot.isFastBoot) {
      this.userAgent = this.fastboot.request.headers.headers['user-agent'][0];

      run(() => {
        if (/(iPhone|iPod)/g.test(this.userAgent)) {
          this.width = this.maxMobileWidthInPx;
          this.height = 480;
        } else if (/(iPad|Android)/g.test(this.userAgent)) {
          this.width = this.maxTabletWidthInPx;
          this.height = 1024;
        } else {
          this.width = 1440;
          this.height = 703;
        }
      });
    } else {
      this.userAgent = window.navigator.userAgent;
      this.runsFakeData =
        ENV['memserver'].enabled && !window.location.href.startsWith('http://localhost:');
      this.updateDimensions();
      this.setBrowserUUID();
      this.updateAfterResize = () => this.updateDimensions();

      window.addEventListener('resize', this.updateAfterResize);
    }

    this.updateDimensions();
  }
  willDestroy() {
    return this.fastboot.isFastBoot
      ? null
      : window.removeEventListener('resize', this.updateAfterResize);
  }
  get isMobile() {
    return this.width <= this.maxMobileWidthInPx;
  }
  get isTablet() {
    return this.width > this.maxMobileWidthInPx && this.width <= this.maxTabletWidthInPx;
  }
  get isDesktop() {
    return this.width > this.maxTabletWidthInPx;
  }
  get isChrome() {
    return this.userAgent.indexOf('Chrome') !== -1;
  }
  get isSafari() {
    return !this.isChrome && this.userAgent.indexOf('Safari') !== -1;
  }
  get isIOS() {
    return /(iPad|iPhone|iPod)/g.test(this.userAgent);
  }
  setBrowserUUID() {
    const browserData = JSON.parse(window.localStorage.getItem('ml-browser')) || {};

    const browserObject = Object.assign(browserData, { uuid: browserData.uuid || generateUUID() });

    this.uuid = browserData.uuid;
    window.localStorage.setItem('ml-browser', JSON.stringify(browserObject));

    return browserData.uuid;
  }
  updateDimensions() {
    this.width = getBrowserWidth();
    this.height = getBrowserHeigth();
  }
}

function getBrowserWidth() {
  if (self.innerWidth) {
    return self.innerWidth;
  }

  if (document.documentElement && document.documentElement.clientWidth) {
    return document.documentElement.clientWidth;
  }

  if (document.body) {
    return document.body.clientWidth;
  }
}

function getBrowserHeigth() {
  if (self.innerHeight) {
    return self.innerHeight;
  }

  if (document.documentElement && document.documentElement.clientHeight) {
    return document.documentElement.clientHeight;
  }

  if (document.body) {
    return document.body.clientHeight;
  }
}
// https://stackoverflow.com/questions/1038727/how-to-get-browser-width-using-javascript-code
