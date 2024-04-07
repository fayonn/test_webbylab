import { injectable } from 'inversify';
import { config } from 'dotenv';
import 'reflect-metadata';
import { join } from 'path';

@injectable()
export class EnvService {
  constructor() {
    config({ path: join(__dirname, '..', '..', 'envs', `.env`) });
  }

  public get(key: string): string | undefined {
    return process.env[key];
  }

  public getOrThrow(key: string): string {
    const value = this.get(key);

    if (!value) {
      throw new Error(`${key} is not found`);
    }

    return value;
  }
}
