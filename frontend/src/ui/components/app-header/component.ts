import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default class AppHeader extends Component {
  @service session;
}
