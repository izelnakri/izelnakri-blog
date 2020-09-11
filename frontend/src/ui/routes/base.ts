import Route from '@ember/routing/route';

export default class BaseRoute extends Route {}

// import Route from '@ember/routing/route';
// import EmberObject, { computed } from '@ember/object';
// import { getOwner } from '@ember/application';
// import { inject as service } from '@ember/service';

// export default Route.extend({
//   fastboot: computed(function() {
//     return getOwner(this).lookup('service:fastboot') || EmberObject.create({}); // TODO: remove after mber upgrade
//   }),
//   headData: service(),
//   i18n: service(),
//   twitterTitle: null,
//   twitterDescription: null,
//   twitterImage: null, // put here default image
//   ogTitle: null,
//   ogDescription: null,
//   ogImage: null, // put here default image
//   afterModel(model) {
//     const i18n = this.get('i18n');
//     const copyReference = `pages.${this.routeName}`;

//     this.set('headData.title', i18n.t(`${copyReference}.title`, { model: model }));
//     this.set('headData.description', i18n.t(`${copyReference}.description`, { model: model }));
//     this.set('headData.url', window ? window.location.href : this.get('fastboot.request.path'));
//     this.setHeaders([
//       'twitterTitle', 'twitterDescription', 'twitterImage', 'ogTitle', 'ogDescription', 'ogImage'
//     ]);
//   },
//   setHeaders(attributes) {
//     attributes.forEach((attribute) => this.set(`headData.${attribute}`, this.get(attribute)));
//   },
//   actions: {
//     loading(transition) {
//       let controller = this.controllerFor(this.routeName);
//       controller.set('currentlyLoading', true);

//       transition.promise.finally(() => {
//         controller.set('currentlyLoading', false);
//       });
//     },
//   }
// });
