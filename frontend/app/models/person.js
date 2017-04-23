import DS from 'ember-data';

const { Model, attr, belongsTo, hasMany } = DS;

export default Model.extend({
  fullName: attr('string'),
  description: attr('string'),

  user: belongsTo(),
  
  emails: hasMany(),
  // comments through emails
})
