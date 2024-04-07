import { IParser } from './parser.interface';
import { MovieInDto } from '../../../dto/movies/movie-in.dto';
import { MovieFormat } from '../../../entities/movie.entity';
import { LoggerService } from '../../logger.service';
import { ParsedData } from '../../../types';

export class MovieParser implements IParser {
  private readonly logger = new LoggerService(MovieParser.name);

  parse(data: Buffer): ParsedData {
    const result: MovieInDto[] = [];
    const lines = data.toString().split('\n');
    let total = 0;

    for (let i = 0; i < lines.length; i += 5) {
      total++;
      try {
        const line: MovieInDto = {
          title: this.parseLine(lines[i])[1],
          year: parseInt(this.parseLine(lines[i + 1])[1]),
          format: this.parseLine(lines[i + 2])[1] as MovieFormat,
          actors: this.parseLine(lines[i + 3])[1].split(', '),
        };

        result.push(line);
      } catch (e) {
        this.logger.warn(`Lines [${i + 1}+(5)] are skipped`);
        this.logger.error(e);
      }
    }

    return {
      data: result,
      meta: {
        total: total,
      },
    };
  }

  private parseLine(line: string) {
    const [key, ...values] = line.split(':');
    const value = values.join(':').trim();
    return [key, value];
  }
}
