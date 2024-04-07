import { injectable } from 'inversify';
import { IParser } from './parsers/parser.interface';
import { extname } from 'path';
import { ParsedData } from '../../types';

@injectable()
export class FilesService {
  parse(data: Buffer, parser: IParser): ParsedData {
    return parser.parse(data);
  }

  validateExtension(filename: string, extension: string) {
    return extname(filename) === extension;
  }
}
