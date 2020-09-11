import Model, { attr, belongsTo } from '@ember-data/model';

export default class Comment extends Model {
  @attr('string') content;
  @attr('date') confirmedAt;
  @attr('date') insertedAt;
  @attr('date') updatedAt;

  @belongsTo email;
  @belongsTo blogPost;
  @belongsTo person;
}
