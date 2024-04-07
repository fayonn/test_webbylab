import { inject, injectable } from 'inversify';
import { Binder } from './utils/binder';
import { Dependency } from '../container/dependency';
import { NextFunction, Request, Response } from 'express';
import { ValidationMiddleware } from './middlewares/validations/validation.middleware';
import { AuthService } from '../services/auth.service';
import { AuthOutDto } from '../dto/auth/auth-out.dto';
import { LoginInDto } from '../dto/sessions/login-in.dto';

@injectable()
export class SessionsController extends Binder {
  constructor(@inject(Dependency.AuthService) private readonly authService: AuthService) {
    super();

    this.bindRoutes([
      { path: `/`, method: 'post', func: this.login, middlewares: [new ValidationMiddleware(LoginInDto)] },
    ]);
  }

  async login({ body }: Request<{}, {}, LoginInDto>, res: Response, next: NextFunction) {
    const token = await this.authService.login(body.email, body.password);
    res.sendRes({ token: token }, AuthOutDto);
  }
}
