import { htmlSafe } from '@ember/string';
import FormComponent from 'frontend/src/utils/base-classes/form-component';

export default class TextArea extends FormComponent<{
  form: any;
  model: any;
  attribute: string;
  rows?: string;
  height?: string;
}> {
  get rows() {
    return this.args.rows || '3';
  }

  get actualStyle() {
    const height = this.args.height || '180';

    return htmlSafe(`height: ${height}px;`);
  }
}
