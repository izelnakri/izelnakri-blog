import Ember from 'ember';
import FormComponentMixin from 'frontend/mixins/form-component';

const { Component, computed, inject } = Ember;
const { singularize } = Ember.String;

export default Component.extend(FormComponentMixin, {
  store: inject.service(),
  keyUp(event) {
    const string = event.target.value

    if (keyIsDelete(event)) {
      // TODO: if key is delete
    }

    if (keyIsEnter(event)) {
      // TODO: if key is enter
    }

    if (string.endsWith(' ')) {
      const actualTagNames = this.get(`model.${this.get('attribute')}`).mapBy('name');
      const parsedTagNames = string.split(' ');

      return parsedTagNames.forEach((tagName) => {
        if (!actualTagNames.includes(tagName)) {
          const modelType = this.get(`model.${this.get('attribute')}`).content.relationship.key;
          console.log(singularize(modelType));
          console.log(tagName);
          this.get(`model.${this.get('attribute')}`).pushObject(
            this.get('store').createRecord(singularize(modelType), { name: tagName })
          );
        }
      });
    }
  },
  tags: computed('model.@each', 'value.@each', function() {
    const array = this.get(`model.${this.get('attribute')}`);

    return array.map((tag) => tag.get('name')).join(' ');
  })
});

function keyIsDelete(event) {

}

function keyIsEnter(event) {

}
