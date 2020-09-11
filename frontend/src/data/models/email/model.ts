import Model, { attr, belongsTo } from '@ember-data/model';

export default class Email extends Model {
  @attr('string') address;

  @attr('date') confirmedAt;
  @attr('date') insertedAt;
  @attr('date') updatedAt;

  @belongsTo person;
}
