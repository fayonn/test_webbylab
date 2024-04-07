import { ParsedData } from '../../../types';

export interface IParser {
  parse: (data: Buffer) => ParsedData;
}
