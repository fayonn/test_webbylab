export enum ExceptionCode {
  MOVIE_EXISTS = 'MOVIE_EXISTS',
  MOVIE_NOT_FOUND = 'MOVIE_NOT_FOUND',

  FILE_MISSED = 'FILE_MISSED',
  FILE_ARRAY_REQUIRED = 'FILE_ARRAY_REQUIRED',
  FILE_SINGLE_REQUIRED = 'FILE_SINGLE_REQUIRED',
  FILE_EXTENSION_WRONG = 'FILE_EXTENSION_WRONG',

  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  UNPROCESSABLE_CONTENT = 'UNPROCESSABLE_CONTENT',

  EMAIL_NOT_UNIQUE = 'EMAIL_NOT_UNIQUE',

  FORMAT_ERROR = 'FORMAT_ERROR',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
}
