import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from './middleware.interface';

export interface IControllerRoute {
  path: string;
  func: (req: Request<any, any, any, any>, res: Response, next: NextFunction) => void;
  method: keyof Pick<Router, 'get' | 'put' | 'patch' | 'delete' | 'post'>;
  middlewares?: IMiddleware[];
}
