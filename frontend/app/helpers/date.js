import Ember from 'ember';

export default Ember.Helper.helper(function([date, format]) {
  switch (format) {
    default:
      return moment(date).calendar(null, {
        sameDay: '[Today]',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'MMMM DD, YYYY'
      });
  }
});
