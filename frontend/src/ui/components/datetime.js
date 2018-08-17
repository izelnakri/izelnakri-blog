import moment from 'moment';
import Helper from '@ember/component/helper';

export let helper = Helper.helper(([date, format]) => {
  return moment(date).calendar(null, {
    sameDay: '[Today], HH:mm',
    lastDay: '[Yesterday], HH:mm',
    lastWeek: '[Last] dddd, HH:mm',
    sameElse: 'MMMM DD, YYYY, HH:mm'
  });
});
