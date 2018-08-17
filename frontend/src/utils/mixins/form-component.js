import Mixin from '@ember/object/mixin';
import { computed, defineProperty } from '@ember/object';
import { inject as service } from '@ember/service';

export default Mixin.create({
  i18n: service(),
  required: false,
  model: computed.alias('form.model'),
  placeholder: computed('label', function() {
    return this.label;
  }),
  label: computed('model.@each', 'attribute', function() {
    const modelName = this.get('model.constructor.modelName');

    if (modelName) {
      const attributeName = this.attribute.underscore();

      return this.i18n.t(`models.${modelName}.${attributeName}`);
    }
  }),
  name: computed('model', 'attribute', function() {
    const constructorName = this.get('model.constructor.modelName');
    const modelName = constructorName ? constructorName.underscore() : null;
    const attributeName = this.attribute.underscore();

    return modelName ? `${modelName}.${attributeName}` : attributeName;
  }),
  init() {
    this._super(...arguments);

    if (!this.form) {
      throw new Error('Form reference missing in one of the form components!!');
    } else if (!this.attribute) {
      throw new Error('Attribute reference is missing in one of the form components!!');
    }

    defineProperty(this, 'value', computed.alias(`model.${this.attribute}`));
  }
});
