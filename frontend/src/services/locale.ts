import Service from '@ember/service';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'frontend/config/environment';

export default class LocalService extends Service {
  @service i18n;
  @service session;

  get currentLocale() {
    return this.setLocale(this.getCurrentLocale());
  }

  constructor() {
    super(...arguments);
    this.setLocale(this.getCurrentLocale());
  }

  getCurrentLocale() {
    const userLocale = get(this.session, 'currentUser.locale');
    const cachedLocale = window.localStorage.getItem('in-locale');
    const locale = userLocale || cachedLocale || config.i18n.defaultLocale;

    return this.i18n.locales.includes(locale) ? locale : config.i18n.defaultLocale;
  }
  chooseLocale(locale) {
    this.setLocale(locale);

    let user = this.session.currentUser;

    if (user && user.locale !== locale) {
      user.set('locale', locale);
      user.save();
    }
  }
  setLocale(locale) {
    set(this.i18n, 'locale', locale);
    window.localStorage.setItem('in-locale', locale);

    return locale;
  }
}
