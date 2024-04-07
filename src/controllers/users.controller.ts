import { inject, injectable } from 'inversify';
import { Binder } from './utils/binder';
import { Dependency } from '../container/dependency';
import { NextFunction, Request, Response } from 'express';
import { ValidationMiddleware } from './middlewares/validations/validation.middleware';
import { AuthService } from '../services/auth.service';
import { UserInDto } from '../dto/users/user-in.dto';
import { AuthOutDto } from '../dto/auth/auth-out.dto';

@injectable()
export class UsersController extends Binder {
  constructor(@inject(Dependency.AuthService) private readonly authService: AuthService) {
    super();

    this.bindRoutes([
      { path: `/`, method: 'post', func: this.register, middlewares: [new ValidationMiddleware(UserInDto)] },
    ]);
  }

  async register({ body }: Request<{}, {}, UserInDto>, res: Response, next: NextFunction) {
    const token = await this.authService.register(body);
    res.sendRes({ token: token }, AuthOutDto);
  }
}
