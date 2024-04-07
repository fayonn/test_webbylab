import { LoggerService } from '../../services/logger.service';
import { Worker } from 'node:worker_threads';
import { HandlerDto } from '../dto/handler-dto';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export abstract class WorkerHandler {
  abstract run(...args: any): Promise<void>;

  static createWorker<T extends HandlerDto>(path: string, workerData: T, logger: LoggerService) {
    const worker = new Worker(path, {
      workerData: {
        ...workerData,
        path: './index.ts',
      },
    });

    worker.on('error', (error) => {
      logger.error(error);
    });
  }
}
