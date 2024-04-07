import { injectable } from 'inversify';
import { createHash } from 'crypto';

@injectable()
export class HashService {
  constructor() {}

  createHash(value: string, algorithm: string = 'sha256') {
    return createHash(algorithm).update(value).digest('hex');
  }

  compareHash(value: string, hash: string, algorithm: string = 'sha256') {
    return this.createHash(value, algorithm) === hash;
  }
}
