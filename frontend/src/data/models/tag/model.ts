import Model, { attr } from '@ember-data/model';

export default class Tag extends Model {
  @attr('string') name;

  @attr('date') insertedAt;
  @attr('date') updatedAt;
}
