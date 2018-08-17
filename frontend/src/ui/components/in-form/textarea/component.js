import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import FormComponentMixin from 'frontend/src/utils/mixins/form-component';

export default Component.extend(FormComponentMixin, {
  class: '',
  tagName: 'div',
  hint: null,
  required: false,
  actualStyle: computed('height', function() {
    const height = this.height || '180';

    return htmlSafe(`height: ${height}px;`);
  }),
  keyUp() {
    this.model.set(this.attribute, this.$('textarea').val());
  },
  change() {
    this.model.set(this.attribute, this.$('textarea').val());
  }
});
