import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    primaryEmail: { embedded: 'always' },
    person: { embedded: 'always' }
  }
});
