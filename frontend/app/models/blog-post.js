import DS from 'ember-data';

const { Model, attr, belongsTo } = DS;

export default Model.extend({
  title: attr('string'),
  content: attr('string'),
  slug: attr('string'),
  tag: attr('string'),

  user: belongsTo()
});
