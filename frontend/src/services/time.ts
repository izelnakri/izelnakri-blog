import Service from '@ember/service';
import { run } from '@ember/runloop';

export default class TimeService extends Service {
  now = new Date();
  interval = null;

  constructor() {
    super(...arguments);
    this.now = new Date();
    this.interval = window.setInterval(() => {
      run(() => (this.now = new Date()));
    }, 1000);
  }

  willDestroy() {
    window.clearInterval(this.interval);
  }
}
