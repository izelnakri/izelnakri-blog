import moment from 'moment';
import Helper from '@ember/component/helper';

export let helper = Helper.helper(([date, format]) => {
  return moment(date).calendar(null, {
    sameDay: '[Today]',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'MMMM DD, YYYY'
  });
});
