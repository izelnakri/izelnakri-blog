import Models from './models/index';
import fixtures from './fixtures/index';

export default function () {
  Object.keys(Models).forEach((modelName) => Models[modelName].resetDatabase(fixtures[modelName]));
  // Models
}
