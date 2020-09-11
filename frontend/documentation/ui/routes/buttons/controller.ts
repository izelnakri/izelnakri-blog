import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class DocumentationButtonsController extends Controller {
  @action
  alertButton() {
    prompt('Button click action called');
  }
}
