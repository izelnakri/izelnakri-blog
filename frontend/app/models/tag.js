import DS from 'ember-data';

const { Model, attr, hasMany } = DS;

export default Model.extend({
  name: attr('string'),

  insertedAt: attr('date'),
  updatedAt: attr('date')
});
