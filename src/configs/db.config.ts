import { Sequelize } from 'sequelize-typescript';
import { injectable } from 'inversify';
import { Movie } from '../entities/movie.entity';
import { MovieActor } from '../entities/associations/movie-actor.entity';
import { Actor } from '../entities/actor.entity';
import { User } from '../entities/user.entity';

@injectable()
export class DBConfig {
  readonly sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: 'database.sqlite',
      models: [MovieActor, Actor, Movie, User],
      logging: false,
      repositoryMode: true,
    });
  }
}
