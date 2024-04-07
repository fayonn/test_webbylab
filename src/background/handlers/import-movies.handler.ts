import { inject, injectable } from 'inversify';
import { WorkerHandler } from './worker-handler';
import { Dependency } from '../../container/dependency';
import { LoggerService } from '../../services/logger.service';
import { ImportMoviesDto } from '../dto/import-movies.dto';
import { FilesService } from '../../services/files/files.service';
import { MovieParser } from '../../services/files/parsers/movie.parser';
import { MoviesService } from '../../services/movies.service';

@injectable()
export class ImportMoviesHandler extends WorkerHandler {
  constructor(
    @inject(Dependency.LoggerService) private readonly logger: LoggerService,
    @inject(Dependency.FilesService) private readonly filesService: FilesService,
    @inject(Dependency.MoviesService) private readonly moviesService: MoviesService,
  ) {
    super();
  }

  async run(data: ImportMoviesDto) {
    const parsedData = this.filesService.parse(Buffer.from(data.file.data), new MovieParser());
    const movies = await this.moviesService.saveManyMovies(parsedData.data);

    this.logger.info(`Movies were saved | imported=${movies.length}`);
  }
}
