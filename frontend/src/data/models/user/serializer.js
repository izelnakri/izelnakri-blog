import ApplicationSerializer from '../application/serializer';

export default ApplicationSerializer.extend({
  attrs: {
    primaryEmail: { embedded: 'always' },
    person: { embedded: 'always' }
  }
});
