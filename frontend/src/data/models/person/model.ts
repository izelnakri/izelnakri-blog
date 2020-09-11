import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class Person extends Model {
  @attr('string') fullName;
  @attr('string') description;

  @belongsTo person;
  @hasMany emails;
  // comments through emails
}
