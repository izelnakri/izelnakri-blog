import DS from 'ember-data';
import { underscore } from '@ember/string';

const { RESTSerializer, EmbeddedRecordsMixin } = DS;

export default RESTSerializer.extend(EmbeddedRecordsMixin, {
  keyForAttribute(attr) {
    return underscore(attr);
  },
  keyForRelationship(key, typeClass, method) {
    if (method === 'serialize') {
      return underscore(key);
    }

    return `${underscore(key)}_id`;
  },
  serializeIntoHash(data, type, record, options) {
    const root = underscore(type.modelName);
    data[root] = this.serialize(record, options);
  }
});


//   serializeIntoHash(data, type, record, options) {
//     const root = underscore(type.modelName);
//     data[root] = this.serialize(record, options);
//   }
