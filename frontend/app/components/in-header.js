import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  classNames: ['in-header', 'navbar', 'navbar-light', 'bg-faded', 'navbar-toggleable-md', 'fixed-top'],
  tagName: 'nav',
  currentUser: computed.alias('session.currentUser')
});
