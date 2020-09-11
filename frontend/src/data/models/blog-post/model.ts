// import $ from 'jquery';
// import marked from 'marked';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
// import { observer } from '@ember/object';
// import { dasherize } from '@ember/string';

export default class BlogPost extends Model {
  @attr('string') title;
  @attr('string') markdownContent;
  @attr('string') slug;

  @attr('string') metaTitle;
  @attr('string') metaDescription;
  @attr('string') imageUrl;

  @attr('date') publishedAt;
  @attr('date') insertedAt;
  @attr('date') updatedAt;

  @belongsTo user;
  @hasMany tags;
  @hasMany comments;

  // titleChange: observer('title', function () {
  //   if (this.get('isNew')) {
  //     this.set('slug', dasherize(this.get('title')).replace('&', 'and'));
  //     this.set('metaTitle', this.get('title'));
  //   }
  // }),
  // contentChange: observer('markdownContent', function () {
  //   if (this.get('isNew')) {
  //     const html = $(marked(this.get('markdownContent'))),
  //       targetText = html.find('p').text() ? html.find('p').text() : html.text(),
  //       content = targetText.replace('\n', '');

  //     this.set('metaDescription', content.length > 155 ? content.slice(0, 155) + '...' : content);
  //   }
  // }),
}
