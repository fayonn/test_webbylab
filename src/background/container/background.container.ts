import { ImportMoviesHandler } from '../handlers/import-movies.handler';
import { BackgroundDependency } from './background-dependency';
import { AppContainer } from '../../container/app.container';

export class BackgroundContainer extends AppContainer {
  constructor() {
    super();

    this.bind<ImportMoviesHandler>(BackgroundDependency.ImportMoviesHandler).to(ImportMoviesHandler).inSingletonScope();
  }
}
