import Ember from 'ember';
import PrivateRoute from 'frontend/mixins/private-route';

const { Route } = Ember;

export default Route.extend(PrivateRoute, {});
