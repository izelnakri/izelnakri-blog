import moment from 'moment';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import ENV from 'frontend/config/environment';

export default Service.extend({
  i18n: service(),
  session: service(),

  currentLocale: computed('session.currentUser.@each', function() {
    return this.setLocale(this.getCurrentLocale());
  }),

  init() {
    this._super(...arguments);
    this.setLocale(this.getCurrentLocale());
  },

  getCurrentLocale() {
    const userLocale = this.get('session.currentUser.locale');
    const cachedLocale = window.localStorage.getItem('in-locale');
    const locale = userLocale || cachedLocale || ENV.i18n.defaultLocale;

    return this.i18n.locales.includes(locale) ? locale : ENV.i18n.defaultLocale;
  },
  chooseLocale(locale) {
    this.setLocale(locale);

    let user = this.session.currentUser;

    if (user && user.locale !== locale) {
      user.set('locale', locale);
      user.save();
    }
  },
  setLocale(locale) {
    this.set('i18n.locale', locale);
    window.localStorage.setItem('in-locale', locale);
    moment.locale(locale);

    return locale;
  }
});
