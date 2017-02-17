import Ember from 'ember';
import DS from 'ember-data';

const { underscore } = Ember.String;

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  keyForAttribute(attr) {
    return underscore(attr);
  },
  keyForRelationship(key, typeClass, method) {
    if (method === 'serialize') {
      return underscore(key);
    }

    return underscore(key) + '_id';
  },
  serializeIntoHash(data, type, record, options) {
    const root = underscore(type.modelName);
    data[root] = this.serialize(record, options);
  }
});
