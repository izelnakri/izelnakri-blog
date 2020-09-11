import $ from 'jquery';

export default function (domString, index?) {
  if (domString[0] === '.') {
    const classReference = domString.split(' ')[0];
    const selectorString = domString.slice(classReference.length + 1);

    return $(`${classReference} ${testSelection(selectorString, index)}`)
      .text()
      .trim();
  }

  return $(testSelection(domString, index)).text().trim();
}

function testSelection(input, index) {
  return index >= 0 || index ? `[data-test-${input}="${index}"]` : `[data-test-${input}]`;
}
