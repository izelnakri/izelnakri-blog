export default function(name) {
  return document.querySelector(`[data-test-input="${name}"]`).getAttribute('placeholder');
}
