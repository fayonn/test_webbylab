import { inject, injectable } from 'inversify';
import { Dependency } from '../container/dependency';
import { LoggerService } from './logger.service';
import { DBConfig } from '../configs/db.config';
import { UsersRepository } from '../repositories/users.repository';
import { User } from '../entities/user.entity';

@injectable()
export class UsersService {
  constructor(
    @inject(Dependency.UsersRepository) private readonly usersRepository: UsersRepository,
    @inject(Dependency.LoggerService) private readonly logger: LoggerService,
    @inject(Dependency.DBConfig) private readonly dbConfig: DBConfig,
  ) {}

  async saveUser(obj: Partial<User>) {
    return await this.usersRepository.save(obj);
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneByEmail(email);
  }
}
