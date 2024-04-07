import { IMiddleware } from '../../utils/middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../../../services/logger.service';
import { HttpError } from '../../../exceptions/http-error';
import { ExceptionCode } from '../../../exceptions/exception-code';
import { FieldCode } from '../../../exceptions/field-code';
import { TokenService } from '../../../services/token.service';
import { AppContainer } from '../../../container/app.container';
import { Dependency } from '../../../container/dependency';

export class AuthMiddleware implements IMiddleware {
  private readonly logger = new LoggerService(AuthMiddleware.name);
  private readonly tokenService: TokenService;

  constructor() {
    const appContainer = new AppContainer();
    this.tokenService = appContainer.get<TokenService>(Dependency.TokenService);
  }

  execute({ headers }: Request, res: Response, next: NextFunction) {
    const authHeader = headers['authorization'];
    if (authHeader) {
      const token = authHeader.startsWith('Bearer') ? authHeader.split(' ')[1] : authHeader;
      this.tokenService.verifyToken(token);
    } else {
      throw new HttpError(
        `Token is missed`,
        {
          code: ExceptionCode.FORMAT_ERROR,
          fields: {
            token: FieldCode.REQUIRED,
          },
        },
        403,
      );
    }

    next();
  }
}
