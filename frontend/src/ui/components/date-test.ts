import luxon from 'luxon';
import { date } from 'frontend/src/ui/components/date';
import { module, test } from 'qunit';

const { DateTime } = luxon;

module('Unit | Helper | date', function () {
  test('it works with custom format', function (assert) {
    const format = 'd MMMM yyyy';

    assert.equal(date([new Date(), format]), DateTime.fromJSDate(new Date()).toFormat(format));
  });

  test('it works with default format', function (assert) {
    assert.equal(date([new Date()]), DateTime.fromJSDate(new Date()).toFormat('dd LLLL yyyy'));
  });

  test('fromNow on works for pastTime and futureTime', function (assert) {
    assert.equal(date([createDateInPast({ seconds: 44 })], { fromNow: true }), 'a few seconds ago');
    assert.equal(date([createDateInPast({ minutes: 44 })], { fromNow: true }), '44 minutes ago');
    assert.equal(date([createDateInPast({ days: 25 })], { fromNow: true }), '25 days ago');
    assert.equal(date([createDateInPast({ days: 77 })], { fromNow: true }), '3 months ago');
    assert.equal(date([createDateInPast({ years: 5 })], { fromNow: true }), '5 years ago');

    assert.equal(
      date([createDateInFuture({ seconds: 44 })], { fromNow: true }),
      'in a few seconds'
    );
    assert.equal(date([createDateInFuture({ minutes: 44 })], { fromNow: true }), 'in 44 minutes');
    assert.equal(date([createDateInFuture({ days: 25 })], { fromNow: true }), 'in 25 days');
    assert.equal(date([createDateInFuture({ days: 77 })], { fromNow: true }), 'in 3 months');
    assert.equal(date([createDateInFuture({ years: 5 })], { fromNow: true }), 'in 5 years');
  });
});

function createDateInPast(durationObject) {
  return DateTime.fromJSDate(new Date()).minus(durationObject).toJSDate();
}

function createDateInFuture(durationObject) {
  return DateTime.fromJSDate(new Date()).plus(durationObject).toJSDate();
}
