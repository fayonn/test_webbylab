import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import { Server } from 'http';
import { json } from 'body-parser';
import cors from 'cors';
import { Dependency } from './container/dependency';
import { EnvService } from './services/env.service';
import { DBConfig } from './configs/db.config';
import { ExceptionHandler } from './exceptions/exception.handler';
import { LoggerService } from './services/logger.service';
import { MoviesController } from './controllers/movies.controller';
import fileUpload from 'express-fileupload';
import { FILE_SIZE } from './constants';
import { UsersController } from './controllers/users.controller';
import { SessionsController } from './controllers/sessions.controller';

@injectable()
export class Application {
  private readonly app: Express;
  private readonly port: string;
  private server: Server;

  constructor(
    @inject(Dependency.EnvService) private readonly envService: EnvService,
    @inject(Dependency.DBConfig) private readonly dbConfig: DBConfig,
    @inject(Dependency.MoviesController) private readonly moviesController: MoviesController,
    @inject(Dependency.ExceptionHandler) private readonly exceptionHandler: ExceptionHandler,
    @inject(Dependency.LoggerService) private readonly logger: LoggerService,
    @inject(Dependency.UsersController) private readonly usersController: UsersController,
    @inject(Dependency.SessionsController) private readonly sessionsController: SessionsController,
  ) {
    this.app = express();
    this.port = this.envService.get('APP_PORT') || '3000';
  }

  private useMiddleware(): void {
    this.app.use(json());
    this.app.use(cors());
    this.app.use(
      fileUpload({
        limits: {
          fileSize: FILE_SIZE,
        },
      }),
    );
  }

  private useRoutes(): void {
    this.app.use('/api/v1/movies', this.moviesController.router);
    this.app.use('/api/v1/users', this.usersController.router);
    this.app.use('/api/v1/sessions', this.sessionsController.router);
  }

  private useExceptionHandlers(): void {
    this.app.use(this.exceptionHandler.catch.bind(this.exceptionHandler));
  }

  public async init(): Promise<void> {
    this.useMiddleware();
    this.useRoutes();
    this.useExceptionHandlers();

    this.dbConfig.sequelize.sync().then(() => {
      this.server = this.app.listen(this.port, () => {
        this.logger.info(`Server has been started on http://localhost:${this.port}`);
      });
    });
  }
}
