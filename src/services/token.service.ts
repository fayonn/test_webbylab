import { inject, injectable } from 'inversify';
import { Dependency } from '../container/dependency';
import { EnvService } from './env.service';
import { sign, TokenExpiredError, verify } from 'jsonwebtoken';
import { HttpError } from '../exceptions/http-error';
import { FieldCode } from '../exceptions/field-code';
import { ExceptionCode } from '../exceptions/exception-code';

@injectable()
export class TokenService {
  private readonly tokenPrivateKey: string;
  private readonly tokenPublicKey: string;
  private readonly ALGORITHM = 'RS256';

  constructor(@inject(Dependency.EnvService) private readonly envService: EnvService) {
    this.tokenPrivateKey = this.envService.getOrThrow('TOKEN_PRIVATE_KEY');
    this.tokenPublicKey = this.envService.getOrThrow('TOKEN_PUBLIC_KEY');
  }

  async generateToken(payload: { sub: string | number }, expiresIn: number) {
    const iat: number = Math.floor(Date.now() / 1000);

    return new Promise((resolve, reject) => {
      sign(
        { ...payload, iat: iat },
        this.tokenPrivateKey,
        { algorithm: this.ALGORITHM, expiresIn: expiresIn },
        (error, encoded) => {
          if (error) reject(error);
          resolve(encoded);
        },
      );
    });
  }

  verifyToken(token: string) {
    try {
      const decoded = verify(token, this.tokenPublicKey, {
        algorithms: [this.ALGORITHM],
      });

      return !(new Date() > new Date(parseInt((decoded as any).exp) * 1000));
    } catch (e) {
      let fieldCode = FieldCode.MALFORMED;
      if (e instanceof TokenExpiredError) {
        fieldCode = FieldCode.EXPIRED;
      }

      throw new HttpError(
        `${(e as Error).message}`,
        {
          code: ExceptionCode.FORMAT_ERROR,
          fields: {
            token: fieldCode,
          },
        },
        403,
      );
    }
  }
}
