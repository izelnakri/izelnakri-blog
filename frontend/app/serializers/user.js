import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    emails: { embedded: 'always' }
  }
});
