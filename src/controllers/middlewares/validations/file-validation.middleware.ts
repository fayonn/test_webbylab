import { IMiddleware } from '../../utils/middleware.interface';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../../../services/logger.service';
import { HttpError } from '../../../exceptions/http-error';
import { extname } from 'path';
import { ExceptionCode } from '../../../exceptions/exception-code';
import { FieldCode } from '../../../exceptions/field-code';

interface FileValidationOptions {
  array: boolean;
  extension: '.txt';
}

export class FileValidationMiddleware implements IMiddleware {
  private readonly logger = new LoggerService(FileValidationMiddleware.name);

  constructor(private readonly options: FileValidationOptions) {}

  execute({ files }: Request, res: Response, next: NextFunction) {
    if (!files || !files?.file) {
      throw new HttpError(
        `File(s) not found`,
        {
          code: ExceptionCode.FILE_MISSED,
          fields: {
            files: FieldCode.MISSED,
          },
        },
        422,
      );
    }

    switch (this.options.array) {
      case true: {
        if (!Array.isArray(files.file)) {
          throw new HttpError(
            `File array is required`,
            {
              code: ExceptionCode.FILE_ARRAY_REQUIRED,
              fields: {
                files: FieldCode.UNPROCESSABLE,
              },
            },
            422,
          );
        }

        for (const file of files.file) {
          if (extname(file.name) !== this.options.extension) {
            throw new HttpError(
              `Wrong file extension | fileName=${file.name}`,
              {
                code: ExceptionCode.FILE_EXTENSION_WRONG,
                fields: {
                  files: FieldCode.UNPROCESSABLE,
                },
              },
              422,
            );
          }
        }

        break;
      }
      case false: {
        if (Array.isArray(files.file)) {
          throw new HttpError(
            `Single file is required`,
            {
              code: ExceptionCode.FILE_SINGLE_REQUIRED,
              fields: {
                files: FieldCode.UNPROCESSABLE,
              },
            },
            422,
          );
        }

        if (extname(files.file.name) !== this.options.extension) {
          throw new HttpError(
            `Wrong file extension | fileName=${files.file.name}`,
            {
              code: ExceptionCode.FILE_EXTENSION_WRONG,
              fields: {
                files: FieldCode.UNPROCESSABLE,
              },
            },
            422,
          );
        }

        break;
      }
    }

    next();
  }
}
