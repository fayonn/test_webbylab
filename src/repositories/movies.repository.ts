import { inject, injectable } from 'inversify';
import { Dependency } from '../container/dependency';
import { DBConfig } from '../configs/db.config';
import { Repository } from 'sequelize-typescript';
import { Movie } from '../entities/movie.entity';
import { Transaction } from 'sequelize';
import { Actor } from '../entities/actor.entity';

@injectable()
export class MoviesRepository {
  private readonly sequelizeRepository: Repository<Movie>;
  private readonly actorRS: Repository<Actor>;

  constructor(@inject(Dependency.DBConfig) private readonly dbConfig: DBConfig) {
    this.sequelizeRepository = this.dbConfig.sequelize.getRepository(Movie);
    this.actorRS = this.dbConfig.sequelize.getRepository(Actor);
  }

  async save(obj: Partial<Movie>, transaction?: Transaction) {
    return await this.sequelizeRepository.create(obj, { transaction: transaction });
  }

  async findOneByTitle(title: string) {
    return await this.sequelizeRepository.findOne({
      where: {
        title: title,
      },
    });
  }

  async delete(id: number) {
    return await this.sequelizeRepository.destroy({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, attrs: Partial<Movie>, transaction?: Transaction) {
    return await this.sequelizeRepository
      .update(attrs, {
        where: {
          id: id,
        },
        transaction: transaction,
      })
      .then((res) => {
        if (!res[0]) {
          throw new Error(`Movie was not updated`);
        }

        return true;
      });
  }

  async findOneById(id: number, actors: boolean = false) {
    return await this.sequelizeRepository.findOne({
      where: {
        id: id,
      },
      include: actors ? this.actorRS : undefined,
    });
  }

  async findAllByIds(ids: string[]) {
    return await this.sequelizeRepository.findAll({
      where: {
        id: ids,
      },
    });
  }

  async findAll({
    order = 'ASC',
    sort = 'id',
    limit = 20,
    offset = 0,
    ...props
  }: {
    actor?: string;
    title?: string;
    sort: 'id' | 'title' | 'year';
    order: 'ASC' | 'DESC';
    limit: number;
    offset: number;
    search?: string;
  }) {
    let where = `WHERE `;
    if (props.search) {
      where += `m.title = '${props.search.split('AND')[0].trim()}' and a.full_name = '${props.search.split('AND')[1].trim()}'`;
    } else {
      if (props.title && props.actor)
        where += `m.title = '${props.title.trim()}' OR a.full_name = '${props.actor.trim()}'`;
      else if (props.title) where += `m.title = '${props.title.trim()}'`;
      else if (props.actor) where += `a.full_name = '${props.actor.trim()}'`;
      else where = '';
    }

    const res: any[] = await this.dbConfig.sequelize.query(`
        select distinct m.id as movieId
        from movies m
                 inner join movies_actors ma on m.id = ma.movie_id
                 inner join actors a on a.id = ma.actor_id
            ${where};
    `);

    const ids = res[0].map((r: any) => r.movieId);
    return await this.sequelizeRepository.findAll({
      where: {
        id: ids,
      },
      limit: limit,
      offset: offset,
      order: [[sort, order]],
    });
  }
}
