import { inject, injectable } from 'inversify';
import { Binder } from './utils/binder';
import { Dependency } from '../container/dependency';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../services/logger.service';
import { MoviesService } from '../services/movies.service';
import { MovieInDto } from '../dto/movies/movie-in.dto';
import { ValidationMiddleware } from './middlewares/validations/validation.middleware';
import { HttpError } from '../exceptions/http-error';
import { DBConfig } from '../configs/db.config';
import { MovieOutDto } from '../dto/movies/movie-out.dto';
import { GetAllMoviesQueryDto } from '../dto/movies/queries/get-all-movies-query.dto';
import { MovieListOutDto } from '../dto/movies/movie-list-out.dto';
import { FilesService } from '../services/files/files.service';
import { MovieParser } from '../services/files/parsers/movie.parser';
import { FileArray, UploadedFile } from 'express-fileupload';
import { FileValidationMiddleware } from './middlewares/validations/file-validation.middleware';
import { ExceptionCode } from '../exceptions/exception-code';
import { FieldCode } from '../exceptions/field-code';
import { MovieImportOutDto } from '../dto/movies/movie-import-out.dto';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';

@injectable()
export class MoviesController extends Binder {
  constructor(
    @inject(Dependency.LoggerService) private readonly logger: LoggerService,
    @inject(Dependency.MoviesService) private readonly moviesService: MoviesService,
    @inject(Dependency.FilesService) private readonly filesService: FilesService,
    @inject(Dependency.DBConfig) private readonly dbConfig: DBConfig,
  ) {
    super();

    this.bindRoutes([
      {
        path: `/`,
        method: 'post',
        func: this.saveMovie,
        middlewares: [new ValidationMiddleware(MovieInDto), new AuthMiddleware()],
      },
      {
        path: `/:id`,
        method: 'delete',
        func: this.deleteMovie,
        middlewares: [new ValidationMiddleware(MovieInDto), new AuthMiddleware()],
      },
      {
        path: `/:id`,
        method: 'patch',
        func: this.updateMovie,
        middlewares: [new ValidationMiddleware(MovieInDto), new AuthMiddleware()],
      },
      { path: `/:id`, method: 'get', func: this.getOne, middlewares: [new AuthMiddleware()] },
      {
        path: `/`,
        method: 'get',
        func: this.getAll,
        middlewares: [new ValidationMiddleware(GetAllMoviesQueryDto), new AuthMiddleware()],
      },
      {
        path: `/import`,
        method: 'post',
        func: this.importMovies,
        middlewares: [new FileValidationMiddleware({ extension: '.txt', array: false }), new AuthMiddleware()],
      },
    ]);
  }

  async saveMovie({ body }: Request<{}, {}, MovieInDto>, res: Response, next: NextFunction) {
    const movie = await this.moviesService.findMovieByTitle(body.title);
    if (movie) {
      throw new HttpError(
        'Movie exists',
        {
          code: ExceptionCode.MOVIE_EXISTS,
          fields: {
            title: FieldCode.NOT_UNIQUE,
          },
        },
        409,
      );
    }

    const transaction = await this.dbConfig.sequelize.transaction();

    try {
      const newMovie = await this.moviesService.saveMovie(
        {
          title: body.title,
          year: body.year,
          format: body.format,
        },
        body.actors,
        transaction,
      );

      await transaction.commit();
      this.logger.info(`Movie was saved | id=${newMovie.id}`);

      res.status(201).sendRes(newMovie, MovieOutDto);
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  async deleteMovie({ params }: Request<{ id: number }>, res: Response, next: NextFunction) {
    const movie = await this.moviesService.findMovieById(params.id);
    if (!movie) {
      throw new HttpError(
        'Movie not found',
        {
          code: ExceptionCode.MOVIE_NOT_FOUND,
          fields: {
            id: params.id,
          },
        },
        409,
      );
    }

    await this.moviesService.deleteMovie(params.id);
    this.logger.info(`Movie was deleted | id=${params.id}`);

    res.sendRes({});
  }

  async updateMovie({ body, params }: Request<{ id: number }, {}, MovieInDto>, res: Response, next: NextFunction) {
    const movie = await this.moviesService.findMovieById(params.id);
    if (!movie) {
      throw new HttpError(
        'Movie not found',
        {
          code: ExceptionCode.MOVIE_NOT_FOUND,
          fields: {
            id: params.id,
          },
        },
        409,
      );
    }

    const transaction = await this.dbConfig.sequelize.transaction();

    try {
      const updatedMovie = await this.moviesService.updateMovie(params.id, { ...body, actors: undefined }, body.actors);

      await transaction.commit();
      this.logger.info(`Movie was updated | id=${params.id}`);

      res.sendRes(updatedMovie, MovieOutDto);
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  async getOne({ params }: Request<{ id: number }>, res: Response, next: NextFunction) {
    const movie = await this.moviesService.findMovieById(params.id, true);
    if (!movie) {
      throw new HttpError(
        'Movie not found',
        {
          code: ExceptionCode.MOVIE_NOT_FOUND,
          fields: {
            id: params.id,
          },
        },
        409,
      );
    }

    res.sendRes({ ...movie.dataValues }, MovieOutDto);
  }

  async getAll({ query }: Request<{}, {}, {}, GetAllMoviesQueryDto>, res: Response, next: NextFunction) {
    const movies = await this.moviesService.findAllMovies(query);
    res.sendRes({ data: movies, meta: { total: movies.length } } as MovieListOutDto, MovieListOutDto);
  }

  async importMovies({ files }: Request, res: Response, next: NextFunction) {
    const file = (files as FileArray).file as UploadedFile;
    const parsedData = this.filesService.parse(file.data, new MovieParser());
    const movies = await this.moviesService.saveManyMovies(parsedData.data);

    this.logger.info(`Movies were saved | imported=${movies.length}`);

    // WorkerHandler.createWorker<ImportMoviesDto>(
    //   WORKER_PATH,
    //   {
    //     type: HandlerType.ImportMoviesHandler,
    //     file: {
    //       name: file.name,
    //       data: file.data,
    //     },
    //   },
    //   this.logger,
    // );

    res
      .status(201)
      .sendRes({ data: movies, meta: { total: parsedData.meta.total, imported: movies.length } }, MovieImportOutDto);
  }
}
