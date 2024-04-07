import { workerData } from 'worker_threads';
import { BackgroundContainer } from './container/background.container';
import { LoggerService } from '../services/logger.service';
import { HandlerDto } from './dto/handler-dto';
import { WorkerHandler } from './handlers/worker-handler';

const container = new BackgroundContainer();
const logger = new LoggerService((workerData as HandlerDto).type);
logger.info(`workerData=${workerData}`);

const handler = container.get<WorkerHandler>(Symbol.for((workerData as HandlerDto).type));
handler.run(workerData).then(() => {
  logger.info(`${(workerData as HandlerDto).type} is finished`);
});
