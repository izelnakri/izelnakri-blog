import RESTSerializer, { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';
import { underscore } from '@ember/string';

export default class ApplicationSerializer extends RESTSerializer.extend(EmbeddedRecordsMixin) {
  keyForAttribute(attr) {
    return underscore(attr);
  }
  keyForRelationship(key, typeClass, method) {
    if (method === 'serialize') {
      return underscore(key);
    }

    return `${underscore(key)}_id`;
  }
}

//   serializeIntoHash(data, type, record, options) {
//     const root = underscore(type.modelName);
//     data[root] = this.serialize(record, options);
//   }

//   serializeIntoHash(data, type, record, options) {
//     const root = underscore(type.modelName);
//     data[root] = this.serialize(record, options);
//   }
