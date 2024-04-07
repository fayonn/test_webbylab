import { AppContainer } from './container/app.container';
import { Application } from './app';
import { Dependency } from './container/dependency';

const appContainer = new AppContainer();
const app = appContainer.get<Application>(Dependency.Application);
app.init();
export { app, appContainer };
