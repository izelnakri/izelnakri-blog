import moment from 'moment';
import Service from '@ember/service';
import { run } from '@ember/runloop';

export default Service.extend({
  now: moment(),

  init() {
    this._super(...arguments);
    this.set('now', moment());
    this.set('interval', window.setInterval(() => {
      run(() => this.set('now', moment()));
    }, 1000));
  },

  willDestroy() {
    window.clearInterval(this.interval);
  }
})
