import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class User extends Model {
  @attr('string') authenticationToken;
  @attr('string') passowrd;
  @attr('string') locale;

  @attr('date') lastLoginAt;
  @attr('string') lastLoginUserAgent;
  @attr('string') lastLoginIp;
  @attr('string') lastLoginType;

  @attr('boolean') isAdmin;

  @attr('date') insertedAt;
  @attr('date') updatedAt;

  @belongsTo person;
  @belongsTo('email') primaryEmail;
  @hasMany blogPosts;

  get emails() {
    return this.person && this.person.get('emails');
  }
}
