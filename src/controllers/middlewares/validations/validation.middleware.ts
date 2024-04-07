import { IMiddleware } from '../../utils/middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import { LoggerService } from '../../../services/logger.service';
import { ParsedQs } from 'qs';
import { HttpError } from '../../../exceptions/http-error';
import { ExceptionCode } from '../../../exceptions/exception-code';

export class ValidationMiddleware implements IMiddleware {
  private readonly logger = new LoggerService(ValidationMiddleware.name);

  constructor(private readonly dto: ClassConstructor<object>) {}

  execute(req: Request, res: Response, next: NextFunction) {
    if (Object.keys(req.body).length) {
      const instance = plainToInstance(this.dto, req.body);
      const errors = validateSync(instance);
      if (errors.length) {
        this.throwError(errors);
      }

      req.body = instance;
    }

    if (Object.keys(req.query).length) {
      const instance = plainToInstance(this.dto, req.query);
      const errors = validateSync(instance);
      if (errors.length) {
        this.throwError(errors);
      }

      req.query = instance as ParsedQs;
    }

    next();
  }

  private throwError(errors: ValidationError[]) {
    const fields: Record<string, any> = {};
    errors.forEach((e) => {
      fields[e.property] = e.constraints;
    });

    throw new HttpError(
      `Validation errors [${errors.length}]`,
      {
        code: ExceptionCode.UNPROCESSABLE_CONTENT,
        fields: fields,
      },
      422,
    );
  }
}
