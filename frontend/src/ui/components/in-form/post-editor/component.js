import Component from '@ember/component';
import FormComponentMixin from 'frontend/src/utils/mixins/form-component';

export default Component.extend(FormComponentMixin, {
  classNames: ['in-post-editor'],
  keyUp(event) {
    this.get('model').set(`${this.get('attribute')}`, event.target.value);
  }
});
