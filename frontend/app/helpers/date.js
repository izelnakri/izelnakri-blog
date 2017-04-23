import Ember from 'ember';

export default Ember.Helper.helper(function([date, format]) {
  return moment(date).calendar(null, {
    sameDay: '[Today]',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'MMMM DD, YYYY'
  });
});
