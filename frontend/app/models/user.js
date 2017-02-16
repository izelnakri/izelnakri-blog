import Ember from 'ember';
import DS from 'ember-data';

const { Model, attr, hasMany } = DS;
const { computed } = Ember;

export default Model.extend({
  authenticationToken: attr('string'),
  password: attr('string'),
  emails: hasMany(),

  email: computed('emails.@each', function() {
    return this.get('emails.firstObject');
  })
});
