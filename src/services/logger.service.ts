import { injectable } from 'inversify';
import { Logger } from 'tslog';
import 'reflect-metadata';

@injectable()
export class LoggerService {
  private readonly logger: Logger<unknown>;
  readonly context: string;

  constructor(context: string) {
    this.context = context;
    this.logger = new Logger({
      name: context,
    });
  }

  info(...args: unknown[]): void {
    this.logger.info(...args);
  }

  error(err: any): void {
    const json = JSON.stringify(err);
    this.logger.error(json !== '{}' ? json : { message: err.toString() });
  }

  warn(...args: unknown[]): void {
    this.logger.warn(...args);
  }
}
