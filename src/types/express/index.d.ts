import { Send } from 'express';
import { ClassConstructor } from 'class-transformer';

declare global {
  namespace Express {
    export interface Response {
      sendRes: <T>(body?: any, resType?: ClassConstructor<T>) => Send<ResBody, this>;
    }
  }
}
