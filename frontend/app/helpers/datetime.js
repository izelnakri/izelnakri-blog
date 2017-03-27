import Ember from 'ember';

export default Ember.Helper.helper(function([date, format]) {
  switch (format) {
    default:
      return moment(date).calendar(null, {
        sameDay: '[Today], HH:mm',
        lastDay: '[Yesterday], HH:mm',
        lastWeek: '[Last] dddd, HH:mm',
        sameElse: 'MMMM DD, YYYY, HH:mm'
      });
  }
});
