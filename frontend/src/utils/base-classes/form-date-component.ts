import luxon from 'luxon';
import { action, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import FormComponent, { FormComponentArguments } from './form-component'; // eslint-disable-line

const { DateTime } = luxon;

export default class FormDateComponent<T extends FormComponentArguments> extends FormComponent<T> {
  @tracked maskedDate;
  @tracked displayLabel;
  @tracked displayValue;
  @tracked placeholder;
  @tracked focusPlaceholder;
  @tracked labelClass;

  constructor(owner, args) {
    super(owner, args);

    this.placeholder = this.label;
    this.displayValue = this.value
      ? DateTime.fromJSDate(this.value, { zone: 'UTC' }).toFormat('dd-MM-yyyy')
      : '';
  }

  @action
  startInputMask(element) {
    this.value ? (this.displayLabel = true) : null;
    this.maskedDate = window.vanillaTextMask.maskInput({
      inputElement: element,
      mask(rawText) {
        if (rawText.charAt(6) === '2') {
          return [/\d/, /\d/, '-', /\d/, /\d/, '-', /2/g, /0/g, /0/g, /\d/];
        }

        return [/\d/, /\d/, '-', /\d/, /\d/, '-', /1/g, /9/g, /\d/, /\d/];
      },
      keepCharPositions: true,
      placeholderChar: '_',
      guide: true,
      pipe: window.createAutoCorrectedDatePipe.default('dd-mm-yyyy'),
    });
  }

  @action
  transformMaskedInputToValue(event) {
    const value = event.target.value.trim().split('-').reverse().join('-');
    const targetDate = DateTime.fromFormat(value, 'yyyy-MM-dd', { zone: 'UTC' });

    this.displayValue = event.target.value;

    if (targetDate.isValid) {
      return set(this.model, this.attribute, targetDate.toJSDate());
    }

    set(this.model, this.attribute, null);
  }

  @action
  changePlaceholderOnFocusIn() {
    this.placeholder = 'DD-MM-YYYY';
  }

  @action
  changePlaceholderOnFocusOut() {
    this.displayValue = this.value
      ? DateTime.fromJSDate(this.value, { zone: 'UTC' }).toFormat('dd-MM-yyyy')
      : '';
    this.placeholder = this.value ? 'DD-MM-YYYY' : this.label;
  }
}
