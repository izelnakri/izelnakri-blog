import $ from 'jquery';

export default function (domString, index) {
  if (domString[0] === '.') {
    const classReference = domString.split(' ')[0];
    const selectorString = domString.slice(classReference.length + 1);

    return $(`${classReference} ${testSelection(selectorString, index)}`).val();
  }

  return $(testSelection(domString, index)).val();
}

function testSelection(input, index) {
  return index >= 0 || index ? `[data-test-${input}="${index}"]` : `[data-test-${input}]`;
}
