import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ConfirmationModal extends Component {
  @service modals;

  @tracked model;

  constructor() {
    super(...arguments);

    this.model = Object.assign(
      {
        title: 'Are you sure?',
        text: 'Are you sure you want to do this?',
      },
      this.model
    );
  }

  @action
  confirm() {
    this.modals.close();
    this.modals.promise.resolve();
  }

  @action
  cancel() {
    this.modals.close();
    this.modals.promise.reject();
  }
}
