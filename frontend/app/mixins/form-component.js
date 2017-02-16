import Ember from 'ember';

const { Mixin, assert, computed } = Ember;

export default Mixin.create({
  required: false,
  model: computed.alias('form.model'),
  label: computed('model.@each', 'attribute', function() {
    const model = this.get('model._internalModel');
    if (model) {
      let modelName = model.modelName,
          attrName = this.get('attribute').underscore();

      return this.get('i18n').t(`models.${modelName}.${attrName}`);
    }
  }),
  labelRef: computed('elementId', function() {
    return `${this.get('elementId')}-ref`;
  }),
  init() {
    this._super(...arguments);
    if (!this.get('form')) {
      return assert('Form reference missing in one of the form components!!');
    } else if (!this.get('attribute')) {
      return assert('Attribute reference is missing in of the from components!!');
    }

    this.set('value', computed.alias(`model.${this.get('attribute')}`));
  }
});
