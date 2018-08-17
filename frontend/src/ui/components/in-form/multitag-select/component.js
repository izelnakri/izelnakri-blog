import Component from '@ember/component';
import { inject as service } from '@ember/service';
import FormComponentMixin from 'frontend/src/utils/mixins/form-component';

export default Component.extend(FormComponentMixin, {
  store: service(),
  didInsertElement() {
    let array = this.get('model').get(`${this.get('attribute')}`);
    const modelName = array.content.relationship.relationshipMeta.type;
    const itemLabel = this.get('itemLabel');
    const self = this;

    this.set('normalizedValues', array.map((element) => element.get(itemLabel)).join(','));

    $(`#${this.get('labelRef')}`).val(this.get('normalizedValues'));
    $(`#${this.get('labelRef')}`).selectize({
      create: true,
      maxItems: 5,
      onItemAdd(value, $item) {
        const model = self.get('store').createRecord(modelName, { [itemLabel]: value });
        array.pushObject(model);
      },
      onItemRemove(value, $item) {
        const foundObject = array.find((element) => element.get(itemLabel) === value)
        array.removeObject(foundObject);
      }
    });
  },
});
