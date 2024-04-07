import { Dependency } from '../../container/dependency';

export const BackgroundDependency = {
  ...Dependency,
  ImportMoviesHandler: Symbol.for('ImportMoviesHandler'),
};
