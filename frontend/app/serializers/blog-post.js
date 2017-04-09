import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    user: { embedded: 'always' },
    tags: { embedded: 'always' }
  }
});
