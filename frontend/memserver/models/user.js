import Model from 'memserver/model';
import Email from './email';

export default Model({
  embedReferences: {
    primaryEmail: Email
  },
  findFromHeaders(headers) {
    const authorization = headers.authorization || headers.Authorization;

    if (authorization) {
      return this.findBy({ authentication_token: authorization.slice(7) });
    }
  },
  loginSerializer(user) {
    const filteredUser = Object.filter(this.serialize(user), [
      'password', 'password_digest'
    ]);

    return Object.assign({}, filteredUser, {
    });
  }
});
