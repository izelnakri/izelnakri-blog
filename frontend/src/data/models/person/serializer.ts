import ApplicationSerializer from '../application/serializer';

export default class PersonSerializer extends ApplicationSerializer {
  attrs = {
    emails: { embedded: 'always' },
  };
}
