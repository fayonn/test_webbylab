import { inject, injectable } from 'inversify';
import { Dependency } from '../container/dependency';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { HashService } from './hash.service';
import { TokenService } from './token.service';
import { EnvService } from './env.service';
import { LoggerService } from './logger.service';
import { HttpError } from '../exceptions/http-error';
import { FieldCode } from '../exceptions/field-code';
import { ExceptionCode } from '../exceptions/exception-code';

@injectable()
export class AuthService {
  constructor(
    @inject(Dependency.UsersService) private readonly usersService: UsersService,
    @inject(Dependency.EnvService) private readonly envService: EnvService,
    @inject(Dependency.HashService) private readonly hashService: HashService,
    @inject(Dependency.TokenService) private readonly tokenService: TokenService,
    @inject(Dependency.LoggerService) private readonly logger: LoggerService,
  ) {}

  async register(obj: Partial<User>): Promise<string> {
    const user = await this.usersService.findUserByEmail(obj.email as string);

    if (user) {
      throw new HttpError(
        `User exists`,
        {
          code: ExceptionCode.EMAIL_NOT_UNIQUE,
          fields: { email: FieldCode.NOT_UNIQUE },
        },
        409,
      );
    }

    if (obj.password !== obj.confirmPassword) {
      throw new HttpError(
        `Passwords do not match`,
        {
          code: ExceptionCode.UNPROCESSABLE_CONTENT,
          fields: {
            password: FieldCode.UNPROCESSABLE,
            confirmPassword: FieldCode.UNPROCESSABLE,
          },
        },
        422,
      );
    }

    const clone = { ...obj };
    const hash = this.hashService.createHash(obj.password as string);
    clone.password = hash;
    clone.confirmPassword = hash;

    const newUser = await this.usersService.saveUser(clone);

    const tokenLifetimeInMinutes = +this.envService.getOrThrow('TOKEN_LIFETIME_MINUTES');
    const token = (await this.tokenService.generateToken({ sub: newUser.id }, tokenLifetimeInMinutes * 60)) as string;

    this.logger.info(`User was registered | email=${newUser.email}`);
    return token;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user || !this.hashService.compareHash(password, user.password)) {
      throw new HttpError(
        `Wrong login or password`,
        {
          code: ExceptionCode.AUTHENTICATION_FAILED,
          fields: {
            email: FieldCode.AUTHENTICATION_FAILED,
            password: FieldCode.AUTHENTICATION_FAILED,
          },
        },
        403,
      );
    }

    const tokenLifetimeInMinutes = +this.envService.getOrThrow('TOKEN_LIFETIME_MINUTES');
    return (await this.tokenService.generateToken({ sub: user.id }, tokenLifetimeInMinutes * 60)) as string;
  }
}
