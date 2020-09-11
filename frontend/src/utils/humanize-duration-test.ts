import humanizeDuration from 'frontend/src/utils/humanize-duration';
import { module, test } from 'qunit';

module('Unit | Utils | humanize-duration', function () {
  test('it works for different unixDifferenceStamps', function (assert) {
    assert.equal(humanizeDuration(convertToUnix({ seconds: 44 })), 'a few seconds');
    assert.equal(humanizeDuration(convertToUnix({ seconds: 45 })), 'a minute');
    assert.equal(humanizeDuration(convertToUnix({ seconds: 89 })), 'a minute');
    assert.equal(humanizeDuration(convertToUnix({ seconds: 90 })), '2 minutes');

    assert.equal(humanizeDuration(convertToUnix({ minutes: 44 })), '44 minutes');
    assert.equal(humanizeDuration(convertToUnix({ minutes: 45 })), 'an hour');
    assert.equal(humanizeDuration(convertToUnix({ minutes: 89 })), 'an hour');
    assert.equal(humanizeDuration(convertToUnix({ minutes: 90 })), '2 hours');

    assert.equal(humanizeDuration(convertToUnix({ hours: 5 })), '5 hours');
    assert.equal(humanizeDuration(convertToUnix({ hours: 21 })), '21 hours');
    assert.equal(humanizeDuration(convertToUnix({ hours: 22 })), 'a day');
    assert.equal(humanizeDuration(convertToUnix({ hours: 35 })), 'a day');
    assert.equal(humanizeDuration(convertToUnix({ hours: 36 })), '2 days');

    assert.equal(humanizeDuration(convertToUnix({ days: 1 })), 'a day');
    assert.equal(humanizeDuration(convertToUnix({ days: 5 })), '5 days');
    assert.equal(humanizeDuration(convertToUnix({ days: 7 })), '7 days');
    assert.equal(humanizeDuration(convertToUnix({ days: 25 })), '25 days');

    assert.equal(humanizeDuration(convertToUnix({ days: 26 })), 'a month');
    assert.equal(humanizeDuration(convertToUnix({ days: 30 })), 'a month');
    assert.equal(humanizeDuration(convertToUnix({ days: 45 })), 'a month');

    assert.equal(humanizeDuration(convertToUnix({ days: 46 })), '2 months');
    assert.equal(humanizeDuration(convertToUnix({ days: 74 })), '2 months');
    assert.equal(humanizeDuration(convertToUnix({ days: 77 })), '3 months');

    assert.equal(humanizeDuration(convertToUnix({ months: 1 })), 'a month');
    assert.equal(humanizeDuration(convertToUnix({ months: 5 })), '5 months');
    assert.equal(humanizeDuration(convertToUnix({ days: 344 })), 'a year');
    assert.equal(humanizeDuration(convertToUnix({ days: 345 })), 'a year');
    assert.equal(humanizeDuration(convertToUnix({ days: 547 })), 'a year');

    assert.equal(humanizeDuration(convertToUnix({ days: 548 })), '2 years');
    assert.equal(humanizeDuration(convertToUnix({ years: 1 })), 'a year');
    assert.equal(humanizeDuration(convertToUnix({ years: 5 })), '5 years');

    assert.equal(
      humanizeDuration(
        convertToUnix({
          years: 1,
          months: 10,
          days: 0,
          hours: 11,
          minutes: 43,
        })
      ),
      '2 years'
    );
  });
});

function convertToUnix(object) {
  return Object.keys(object).reduce((result, key) => {
    if (key === 'seconds') {
      return result + object.seconds * 1000;
    } else if (key === 'minutes') {
      return result + object.minutes * 60000;
    } else if (key === 'hours') {
      return result + object.hours * 1000 * 60 * 60;
    } else if (key === 'days') {
      return result + object.days * 24 * 60 * 60 * 1000;
    } else if (key === 'months') {
      return result + object.months * 30 * 24 * 60 * 60 * 1000;
    } else if (key === 'years') {
      return result + object.years * 365 * 24 * 60 * 60 * 1000;
    }
  }, 0);
}
