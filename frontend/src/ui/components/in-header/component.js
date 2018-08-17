import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['in-header', 'navbar', 'navbar-light', 'bg-faded', 'navbar-toggleable-md', 'fixed-top'],
  tagName: 'nav',
  currentUser: computed.alias('session.currentUser')
});
