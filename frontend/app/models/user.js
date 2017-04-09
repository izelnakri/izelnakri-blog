import Ember from 'ember';
import DS from 'ember-data';

const { Model, attr, belongsTo, hasMany } = DS;
const { computed } = Ember;

export default Model.extend({
  authenticationToken: attr('string'),
  password: attr('string'),
  locale: attr('string'),

  lastLoginAt: attr('string'),
  lastLoginUserAgent: attr('string'),
  lastLoginIp: attr('string'),
  lastLoginType: attr('string'),

  isAdmin: attr('boolean'),

  insertedAt: attr('date'),
  updatedAt: attr('date'),

  person: belongsTo(),
  primaryEmail: belongsTo('email'),

  blogPosts: hasMany(),
  emails: computed.alias('person.emails')
});
