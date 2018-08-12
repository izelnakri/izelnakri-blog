import ApplicationSerializer from '../application/serializer';

export default ApplicationSerializer.extend({
  attrs: {
    user: { embedded: 'always' },
    tags: { embedded: 'always' }
  }
});
