import Resolver from 'ember-resolver/resolvers/fallback';
import buildResolverConfig from 'ember-resolver/ember-config';
import ENV from '../config/environment';

let moduleConfig = buildResolverConfig(ENV.modulePrefix);

/*
 * If your application has custom types and collections, modify moduleConfig here
 * to add support for them.
 */

 moduleConfig.types = Object.assign({}, moduleConfig.types, { // NOTE: needed fast fastboot!
   ajax: { definitiveCollection: 'main' },
   mixin: { definitiveCollection: 'main' }
 });

export default Resolver.extend({
  config: moduleConfig
});
