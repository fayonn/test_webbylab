import { inject, injectable } from 'inversify';
import { Repository } from 'sequelize-typescript';
import { MovieActor } from '../../entities/associations/movie-actor.entity';
import { DBConfig } from '../../configs/db.config';
import { Dependency } from '../../container/dependency';
import { Op, Transaction } from 'sequelize';

@injectable()
export class MoviesActorsRepository {
  private readonly sequelizeRepository: Repository<MovieActor>;

  constructor(@inject(Dependency.DBConfig) private readonly dbConfig: DBConfig) {
    this.sequelizeRepository = this.dbConfig.sequelize.getRepository(MovieActor);
  }

  async saveMany(objs: Partial<MovieActor>[], transaction?: Transaction): Promise<MovieActor[]> {
    return await this.sequelizeRepository
      .bulkCreate(objs, { transaction: transaction })
      .then((res) => res.map((x) => x.get()));
  }

  async findAllByMovieIdAndActorId(objs: Partial<MovieActor>[]): Promise<MovieActor[]> {
    return await this.sequelizeRepository
      .findAll({
        where: {
          [Op.or]: objs.map((o) => {
            return {
              movieId: o.movieId,
              actorId: o.actorId,
            };
          }),
        },
      })
      .then((res) => res.map((x) => x.get()));
  }

  async findAllByMovieId(movieId: number): Promise<MovieActor[]> {
    return await this.sequelizeRepository
      .findAll({
        where: {
          movieId: movieId,
        },
      })
      .then((res) => res.map((x) => x.get()));
  }
}
