import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { HttpError } from './http-error';
import { Dependency } from '../container/dependency';
import { LoggerService } from '../services/logger.service';
import { Error } from 'sequelize';
import { ExceptionCode } from './exception-code';
import { FieldCode } from './field-code';

type ErrorResponse = {
  status: number;
  error: {
    fields?: Record<string, FieldCode | number | Record<string, any>>;
    code: ExceptionCode;
  };
};

@injectable()
export class ExceptionHandler {
  constructor(@inject(Dependency.LoggerService) private readonly logger: LoggerService) {}

  public catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
    this.logger.error(err);
    let statusCode = 500;
    let body: ErrorResponse;

    if (err instanceof HttpError) {
      statusCode = err.statusCode;
      body = {
        status: err.status,
        error: {
          code: err.error.code,
          fields: err.error.fields,
        },
      };
    } else {
      body = {
        status: 0,
        error: {
          code: ExceptionCode.INTERNAL_SERVER_ERROR,
        },
      };
    }

    res.status(statusCode).send(body);
  }
}
