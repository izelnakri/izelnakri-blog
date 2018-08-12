import DS from 'ember-data';

const { Model, attr, belongsTo } = DS;

export default Model.extend({
  content: attr('string'),

  confirmedAt: attr('date'),
  insertedAt: attr('date'),
  updatedAt: attr('date'),

  email: belongsTo(),
  blogPost: belongsTo(),
  person: belongsTo()
});
