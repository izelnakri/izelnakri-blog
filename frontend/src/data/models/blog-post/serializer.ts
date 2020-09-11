import ApplicationSerializer from '../application/serializer';

export default class BrowserSerializer extends ApplicationSerializer {
  attrs = {
    user: { embedded: 'always' },
    tags: { embedded: 'always' },
  };
}
