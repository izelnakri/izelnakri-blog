import Ember from 'ember';
import DS from 'ember-data';

const { Model, attr, belongsTo, hasMany } = DS;

export default Model.extend({
  title: attr('string'),
  markdownContent: attr('string'),
  slug: attr('string'),

  metaTitle: attr('string'),
  metaDescription: attr('string'),
  imageUrl: attr('string'),

  publishedAt: attr('date'),
  insertedAt: attr('date'),
  updatedAt: attr('date'),

  titleChange: Ember.observer('title', function() {
    if (this.get('isNew')) {
      this.set('slug', Ember.String.dasherize(this.get('title')).replace('&', 'and'));
      this.set('metaTitle', this.get('title'));
    }
  }),
  contentChange: Ember.observer('markdownContent', function() {
    if (this.get('isNew')) {
      const html = $(marked(this.get('markdownContent'))),
            targetText = html.find('p').text() ? html.find('p').text() : html.text(),
            content = targetText.replace('\n', '');

      this.set('metaDescription', content.length > 155 ? content.slice(0, 155) + '...' : content);
    }
  }),

  user: belongsTo(),
  tags: hasMany(),
  comments: hasMany()
});
