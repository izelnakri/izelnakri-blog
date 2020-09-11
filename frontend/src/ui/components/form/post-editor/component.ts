import FormComponent from 'frontend/src/utils/base-classes/form-component';

export default class Password extends FormComponent<{
  form: any;
  model: any;
  attribute: string;
  placeholder?: string;
  required?: boolean;
}> {}
