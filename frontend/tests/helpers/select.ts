// @ts-nocheck
import { registerAsyncHelper } from '@ember/test';
import { run } from '@ember/runloop';
import { find } from '@ember/test-helpers';

export default registerAsyncHelper('select', function (app, selector, name) {
  const $el = find(selector); // NOTE: it was findWithAssert
  const optionValueIsNumber = /^[0-9]*$/g.test(name);
  const targetValue = optionValueIsNumber ? parseInt(name, 10) : name;
  const targetElement = $el.find(`option[value=${targetValue}]`);

  if (!$el.attr('disabled')) {
    run(() => {
      $el.find('option[selected]').prop('selected', false);
      targetElement.prop('selected', true).trigger('change');
      targetElement.attr('selected', true);
    });
  }

  // return wait();
});
