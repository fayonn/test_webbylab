import { inject, injectable } from 'inversify';
import { Dependency } from '../container/dependency';
import { DBConfig } from '../configs/db.config';
import { Repository } from 'sequelize-typescript';
import { Actor } from '../entities/actor.entity';
import { Transaction } from 'sequelize';

@injectable()
export class ActorsRepository {
  private readonly sequelizeRepository: Repository<Actor>;

  constructor(@inject(Dependency.DBConfig) private readonly dbConfig: DBConfig) {
    this.sequelizeRepository = this.dbConfig.sequelize.getRepository(Actor);
  }

  async findAllByFullNames(fullNames: string[]) {
    return await this.sequelizeRepository.findAll({
      where: {
        fullName: fullNames,
      },
    });
  }

  async saveMany(objs: Partial<Actor>[], transaction?: Transaction) {
    return await this.sequelizeRepository.bulkCreate(objs, { transaction: transaction });
  }
}
