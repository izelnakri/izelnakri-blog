import Route from '@ember/routing/route';
import PrivateRoute from 'frontend/src/utils/decorators/private-route';

// @ts-ignore
@PrivateRoute
export default class AdminRoute extends Route {}
