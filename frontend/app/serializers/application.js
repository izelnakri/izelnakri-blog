import Ember from 'ember';
import DS from 'ember-data';

const { underscore } = Ember.String;

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  keyForAttribute: function(attr) {
    return underscore(attr);
  },
  keyForRelationship: function(key, typeClass, method) {
    if (method === 'serialize') {
      return underscore(key);
    }

    return underscore(key) + '_id';
  }
});
