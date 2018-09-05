import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  classNames: ['in-header', 'navbar', 'navbar-light', 'bg-faded', 'navbar-toggleable-md', 'fixed-top'],
  tagName: 'nav',
  currentUser: computed.alias('session.currentUser')
});
