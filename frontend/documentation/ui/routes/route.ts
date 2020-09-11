import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class DocumentationApplicationRoute extends Route {
  @service browser;

  model() {
    this.browser.viewsDocumentation = true;
  }
}
