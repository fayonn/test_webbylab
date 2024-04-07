import { Transform } from 'class-transformer';
import { HttpError } from '../exceptions/http-error';
import { ExceptionCode } from '../exceptions/exception-code';
import { FieldCode } from '../exceptions/field-code';

export function TrimString() {
  return Transform((data) => {
    return typeof data.value === 'string' ? data.value.trim() : data.value;
  });
}

export function TrimStringArray() {
  return Transform((data) => {
    return data.value.map((v: unknown) => {
      return typeof v === 'string' ? v.trim() : v;
    });
  });
}

export function TransformToIntQueryParam() {
  return Transform((data) => {
    if (data.value === undefined) return undefined;
    const value = parseInt(data.value);
    if (isNaN(value)) {
      throw new HttpError(
        `${data.key} must be an integer`,
        {
          code: ExceptionCode.UNPROCESSABLE_CONTENT,
          fields: { [data.key]: FieldCode.UNPROCESSABLE },
        },
        422,
      );
    }

    return value;
  });
}
