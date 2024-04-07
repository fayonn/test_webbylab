import { injectable } from 'inversify';
import { Router } from 'express';
import { IControllerRoute } from './route.interface';
import { requestInterceptor } from './request.interceptor';

@injectable()
export abstract class Binder {
  private readonly _router: Router = Router();

  get router(): Router {
    return this._router;
  }

  protected bindRoutes(routes: IControllerRoute[]): void {
    routes.forEach((route) => {
      const middlewares = route.middlewares?.map((x) => x.execute.bind(x));
      const pipeline = middlewares
        ? [...middlewares, requestInterceptor(route.func.bind(this))]
        : [requestInterceptor(route.func.bind(this))];
      this._router[route.method](route.path, pipeline);
    });
  }
}
