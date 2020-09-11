import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default class Post extends Component {
  @service session;
}
