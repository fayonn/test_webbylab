import { inject, injectable } from 'inversify';
import { Dependency } from '../container/dependency';
import { MoviesRepository } from '../repositories/movies.repository';
import { LoggerService } from './logger.service';
import { DBConfig } from '../configs/db.config';
import { Movie } from '../entities/movie.entity';
import { Actor } from '../entities/actor.entity';
import { ActorsService } from './actors.service';
import { MoviesActorsRepository } from '../repositories/associations/movies-actors.repository';
import { Transaction } from 'sequelize';
import { MovieInDto } from '../dto/movies/movie-in.dto';

@injectable()
export class MoviesService {
  constructor(
    @inject(Dependency.MoviesRepository) private readonly moviesRepository: MoviesRepository,
    @inject(Dependency.MoviesActorsRepository) private readonly moviesActorsRepository: MoviesActorsRepository,
    @inject(Dependency.ActorsService) private readonly actorsService: ActorsService,
    @inject(Dependency.LoggerService) private readonly logger: LoggerService,
    @inject(Dependency.DBConfig) private readonly dbConfig: DBConfig,
  ) {}

  async saveMovie(movie: Partial<Movie>, actorNames: string[], transaction?: Transaction): Promise<Movie> {
    const nonExistentMovie = {
      title: movie.title,
      year: movie.year,
      format: movie.format,
    } as Partial<Movie>;
    const newMovie = await this.moviesRepository.save(nonExistentMovie, transaction);
    const actors = await this.actorsService.saveManyActorsIfNotExists(
      actorNames.map((a) => ({ fullName: a }) as Partial<Actor>),
      transaction,
    );
    await newMovie.$add('actors', actors, { transaction: transaction });

    return { ...newMovie.dataValues, actors: actors.map((a) => a.dataValues) };
  }

  async findMovieById(id: number, actors: boolean = false) {
    return await this.moviesRepository.findOneById(id, actors);
  }

  async findMovieByTitle(title: string) {
    return await this.moviesRepository.findOneByTitle(title);
  }

  async deleteMovie(id: number) {
    return await this.moviesRepository.delete(id);
  }

  async updateMovie(
    id: number,
    attrs: Partial<Movie>,
    actorNames: string[],
    transaction?: Transaction,
  ): Promise<Movie> {
    const actors: Actor[] = await this.actorsService.saveManyActorsIfNotExists(
      actorNames.map((a) => ({ fullName: a }) as Partial<Actor>),
      transaction,
    );

    await this.moviesRepository.update(id, attrs, transaction);
    const movie = (await this.findMovieById(id, true)) as Movie;
    await movie.$set('actors', actors, { transaction: transaction });
    movie.actors = actors;

    return movie;
  }

  // sequelize many-to-many limit offset :(
  async findAllMovies({
    order = 'ASC',
    sort = 'id',
    limit = 20,
    offset = 0,
    ...props
  }: {
    actor: string;
    title: string;
    sort: 'id' | 'title' | 'year';
    order: 'ASC' | 'DESC';
    limit: number;
    offset: number;
    search: string;
  }) {
    return await this.moviesRepository.findAll({
      ...props,
      offset,
      limit,
      sort,
      order,
    });
  }

  async saveManyMovies(objs: Partial<MovieInDto>[]) {
    const movies: Partial<Movie>[] = [];
    for (const obj of objs) {
      const transaction = await this.dbConfig.sequelize.transaction();

      try {
        const movie = await this.saveMovie({ ...obj, actors: [] }, obj.actors as string[]);
        movies.push({ ...movie, actors: undefined });

        await transaction.commit();
      } catch (e) {
        this.logger.warn(`Movie is skipped | title=${obj.title}`);
        this.logger.error(e);
        await transaction.rollback();
      }
    }
    return movies;
  }
}
