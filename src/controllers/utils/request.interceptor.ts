import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../../services/logger.service';
import { plainToInstance, ClassConstructor } from 'class-transformer';

export const requestInterceptor =
  (endpoint: (req: Request, res: Response, next: NextFunction) => void) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const logger = new LoggerService(`Request [${req.baseUrl}]`);
    logger.info({
      url: req.baseUrl,
      body: req.body.password ? { ...req.body, password: '[***]', confirmPassword: '[***]' } : req.body,
      query: req.query,
    });

    res.sendRes = <T>(body?: any, resType?: ClassConstructor<T>): void => {
      if (body && resType) {
        const instance = plainToInstance(resType, body, {
          excludeExtraneousValues: true,
        });

        res.send({ ...instance, status: 1 });
      } else {
        res.send({ ...body, status: 1 });
      }
    };

    try {
      await endpoint(req, res, next);
    } catch (e) {
      return next(e);
    }
  };
