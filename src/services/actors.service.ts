import { inject, injectable } from 'inversify';
import { Dependency } from '../container/dependency';
import { LoggerService } from './logger.service';
import { DBConfig } from '../configs/db.config';
import { ActorsRepository } from '../repositories/actors.repository';
import { Actor } from '../entities/actor.entity';
import { Transaction } from 'sequelize';

@injectable()
export class ActorsService {
  constructor(
    @inject(Dependency.ActorsRepository) private readonly actorsRepository: ActorsRepository,
    @inject(Dependency.LoggerService) private readonly logger: LoggerService,
    @inject(Dependency.DBConfig) private readonly dbConfig: DBConfig,
  ) {}

  async findAllActorsByFullNames(fullNames: string[]) {
    return await this.actorsRepository.findAllByFullNames(fullNames);
  }

  async saveActors(objs: Partial<Actor>[], transaction?: Transaction) {
    return await this.actorsRepository.saveMany(objs, transaction);
  }

  async saveManyActorsIfNotExists(objs: Partial<Actor>[], transaction?: Transaction) {
    const actorNames = objs.map((a) => a.fullName as string);
    const existingActors = await this.findAllActorsByFullNames(actorNames);
    const existingActorsNames = existingActors.map((a) => a.fullName);
    const nonExistentActorNames = actorNames.filter((a) => !existingActorsNames.includes(a));
    const nonExistentActors = nonExistentActorNames.map((a) => ({
      fullName: a,
    }));
    const newActors = await this.saveActors(nonExistentActors, transaction);
    return [...existingActors, ...newActors];
  }
}
