import luxon from 'luxon';

export default function (durationInMilliseconds) {
  if (!durationInMilliseconds) {
    return;
  } else if (!Number.isInteger(durationInMilliseconds)) {
    throw new Error(
      `wrong parameter type passed to humanizeDuration(durationInMilliseconds), passed ${durationInMilliseconds}`
    );
  }

  const durationObject = luxon.Duration.fromMillis(durationInMilliseconds)
    .shiftTo('seconds', 'minutes', 'hours', 'days', 'months', 'years')
    .toObject();

  if (durationInMilliseconds < 45000) {
    return 'a few seconds';
  } else if (durationInMilliseconds < 90000) {
    return 'a minute';
  }

  if (durationObject.years) {
    const nearingAddition =
      durationObject.months > 6 || (durationObject.months === 6 && durationObject.days >= 3)
        ? 1
        : 0;
    const targetYears = durationObject.years + nearingAddition;

    return targetYears === 1 ? 'a year' : `${targetYears} years`;
  } else if (durationObject.months) {
    if (durationObject.months >= 11) {
      return 'a year';
    }

    const nearingAddition = durationObject.days >= 16 ? 1 : 0;
    const targetMonths = durationObject.months + nearingAddition;

    return targetMonths === 1 ? 'a month' : `${targetMonths} months`;
  } else if (durationObject.days) {
    if (durationObject.days >= 26) {
      return 'a month';
    }

    const nearingAddition = durationObject.hours >= 12 ? 1 : 0;
    const targetDays = durationObject.days + nearingAddition;

    return targetDays === 1 ? 'a day' : `${targetDays} days`;
  } else if (durationObject.hours) {
    if (durationObject.hours >= 22) {
      return 'a day';
    }

    const nearingAddition = durationObject.minutes >= 30 ? 1 : 0;
    const targetHours = durationObject.hours + nearingAddition;

    return targetHours === 1 ? 'an hour' : `${targetHours} hours`;
  } else if (durationObject.minutes >= 45) {
    return 'an hour';
  } else if (durationObject.minutes) {
    const nearingAddition = durationObject.seconds >= 30 ? 1 : 0;
    const targetMinutes = durationObject.minutes + nearingAddition;

    return targetMinutes === 1 ? 'a minute' : `${targetMinutes} minutes`;
  }
}
