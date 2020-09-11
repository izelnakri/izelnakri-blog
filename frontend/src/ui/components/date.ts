import luxon from 'luxon';
import Helper from '@ember/component/helper';
import humanizeDuration from 'frontend/src/utils/humanize-duration';

const { DateTime } = luxon;

export function date(
  [dateValue, format = 'dd LLLL yyyy'],
  options: { [propName: string]: any } = {}
) {
  if (!dateValue) {
    return;
  } else if (options.fromNow) {
    const unixDifference = +dateValue - +new Date();

    if (options.withouSuffix) {
      return humanizeDuration(unixDifference);
    } else if (unixDifference < 0) {
      return `${humanizeDuration(-unixDifference)} ago`;
    }

    return `in ${humanizeDuration(unixDifference)}`;
  } else if (dateValue) {
    return DateTime.fromJSDate(dateValue).toFormat(format);
  }
}

export let helper = Helper.helper(date);
