import DS from 'ember-data';

const { Model, attr, belongsTo } = DS;

export default Model.extend({
  address: attr('string'),

  confirmedAt: attr('date'),
  insertedAt: attr('date'),
  updatedAt: attr('date'),

  person: belongsTo()
});