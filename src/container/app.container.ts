import { Container } from 'inversify';
import { EnvService } from '../services/env.service';
import { Dependency } from './dependency';
import 'reflect-metadata';
import { Application } from '../app';
import { DBConfig } from '../configs/db.config';
import { ExceptionHandler } from '../exceptions/exception.handler';
import { LoggerService } from '../services/logger.service';
import { MoviesRepository } from '../repositories/movies.repository';
import { MoviesService } from '../services/movies.service';
import { MoviesController } from '../controllers/movies.controller';
import { FilesService } from '../services/files/files.service';
import { UsersRepository } from '../repositories/users.repository';
import { ActorsRepository } from '../repositories/actors.repository';
import { UsersService } from '../services/users.service';
import { HashService } from '../services/hash.service';
import { AuthService } from '../services/auth.service';
import { ActorsService } from '../services/actors.service';
import { MoviesActorsRepository } from '../repositories/associations/movies-actors.repository';
import { TokenService } from '../services/token.service';
import { UsersController } from '../controllers/users.controller';
import { SessionsController } from '../controllers/sessions.controller';

export class AppContainer extends Container {
  constructor() {
    super();

    // configs
    this.bind<DBConfig>(Dependency.DBConfig).to(DBConfig).inSingletonScope();

    // repositories
    this.bind<MoviesRepository>(Dependency.MoviesRepository).to(MoviesRepository).inSingletonScope();
    this.bind<UsersRepository>(Dependency.UsersRepository).to(UsersRepository).inSingletonScope();
    this.bind<ActorsRepository>(Dependency.ActorsRepository).to(ActorsRepository).inSingletonScope();
    this.bind<MoviesActorsRepository>(Dependency.MoviesActorsRepository).to(MoviesActorsRepository).inSingletonScope();

    // services
    this.bind<ExceptionHandler>(Dependency.ExceptionHandler).to(ExceptionHandler).inSingletonScope();
    this.bind<LoggerService>(Dependency.LoggerService).toDynamicValue((context) => {
      return new LoggerService(
        Symbol.keyFor(<symbol>context.currentRequest.parentRequest?.serviceIdentifier) as string,
      );
    });
    this.bind<EnvService>(Dependency.EnvService).to(EnvService).inSingletonScope();
    this.bind<MoviesService>(Dependency.MoviesService).to(MoviesService).inSingletonScope();
    this.bind<FilesService>(Dependency.FilesService).to(FilesService).inSingletonScope();
    this.bind<UsersService>(Dependency.UsersService).to(UsersService).inSingletonScope();
    this.bind<HashService>(Dependency.HashService).to(HashService).inSingletonScope();
    this.bind<AuthService>(Dependency.AuthService).to(AuthService).inSingletonScope();
    this.bind<ActorsService>(Dependency.ActorsService).to(ActorsService).inSingletonScope();
    this.bind<TokenService>(Dependency.TokenService).to(TokenService).inSingletonScope();

    // controllers
    this.bind<MoviesController>(Dependency.MoviesController).to(MoviesController).inSingletonScope();
    this.bind<UsersController>(Dependency.UsersController).to(UsersController).inSingletonScope();
    this.bind<SessionsController>(Dependency.SessionsController).to(SessionsController).inSingletonScope();

    // starter
    this.bind<Application>(Dependency.Application).to(Application).inSingletonScope();
  }
}
