export const Dependency = {
  // configs
  DBConfig: Symbol.for('DBConfig'),

  // repositories
  MoviesRepository: Symbol.for('MoviesRepository'),
  UsersRepository: Symbol.for('UsersRepository'),
  ActorsRepository: Symbol.for('ActorsRepository'),
  MoviesActorsRepository: Symbol.for('MoviesActorsRepository'),

  // services
  EnvService: Symbol.for('EnvService'),
  ExceptionHandler: Symbol.for('ExceptionHandler'),
  LoggerService: Symbol.for('LoggerService'),
  MoviesService: Symbol.for('MoviesService'),
  FilesService: Symbol.for('FilesService'),
  UsersService: Symbol.for('UsersService'),
  HashService: Symbol.for('HashService'),
  AuthService: Symbol.for('AuthService'),
  ActorsService: Symbol.for('ActorsService'),
  TokenService: Symbol.for('TokenService'),

  // controllers
  MoviesController: Symbol.for('MoviesController'),
  UsersController: Symbol.for('UsersController'),
  SessionsController: Symbol.for('SessionsController'),

  // starter
  Application: Symbol.for('Application'),
};
