import $ from 'jquery';
import { action, set } from '@ember/object';
import { inject as service } from '@ember/service';
import FormComponent from 'frontend/src/utils/base-classes/form-component';

export default class Input extends FormComponent<{
  model: any;
  form: any;
  attribute: string;
}> {
  @service store;

  @action
  selectizeInputElement() {
    let array = this.model.get(`${this.attribute}`);
    const modelName = array.content.relationship.relationshipMeta.type;
    const itemLabel = this.itemLabel;
    const self = this;

    this.normalizedValues = array.map((element) => element.get(itemLabel)).join(',');

    $(`#${this.inputId}`).val(this.normalizedValues);
    $(`#${this.inputId}`).selectize({
      create: true,
      maxItems: 5,
      onItemAdd(value) {
        // _$item second param
        const model = self.store.createRecord(modelName, { [itemLabel]: value });
        array.pushObject(model);
      },
      onItemRemove(value) {
        // _$item second param
        const foundObject = array.find((element) => element.get(itemLabel) === value);
        array.removeObject(foundObject);
      },
    });
  }
}
