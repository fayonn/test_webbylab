import { inject, injectable } from 'inversify';
import { Dependency } from '../container/dependency';
import { DBConfig } from '../configs/db.config';
import { Repository } from 'sequelize-typescript';
import { User } from '../entities/user.entity';

@injectable()
export class UsersRepository {
  private readonly sequelizeRepository: Repository<User>;

  constructor(@inject(Dependency.DBConfig) private readonly dbConfig: DBConfig) {
    this.sequelizeRepository = this.dbConfig.sequelize.getRepository(User);
  }

  async save(obj: Partial<User>) {
    return this.sequelizeRepository.create(obj);
  }

  async findOneByEmail(email: string) {
    return this.sequelizeRepository.findOne({
      where: {
        email: email,
      },
    });
  }
}
