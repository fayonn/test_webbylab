import { FieldCode } from './field-code';
import { ExceptionCode } from './exception-code';

type ErrorData = {
  fields: Record<string, FieldCode | number | Record<string, any>>;
  code: ExceptionCode;
};

export class HttpError extends Error {
  status: number = 0;
  error: ErrorData;
  statusCode: number;
  message: string;

  constructor(message: string, error: ErrorData, statusCode: number) {
    super();
    this.error = error;
    this.statusCode = statusCode;
    this.message = message;
  }
}
