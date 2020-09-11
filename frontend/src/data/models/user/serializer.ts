import ApplicationSerializer from '../application/serializer';

export default class UserSerializer extends ApplicationSerializer {
  attrs = {
    primaryEmail: { embedded: 'always' },
    person: { embedded: 'always' },
  };
}
