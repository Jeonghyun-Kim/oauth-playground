import { createError } from '@defines/errors';
import jwt from 'jsonwebtoken';

const JWT_ALGORITHM = 'HS512';
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('Missing JWT_SECRET');

interface SignTokenOption {
  expiresIn?: string | number;
}
export const signToken = (payload: object, options?: SignTokenOption) => {
  return jwt.sign(payload, JWT_SECRET, { algorithm: JWT_ALGORITHM, ...options });
};

interface VerifyTokenOption {
  ignoreExpired?: boolean;
}
export const verifyToken = (token: string, options?: VerifyTokenOption) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      if (options?.ignoreExpired) {
        return jwt.decode(token);
      }

      throw createError('TOKEN_EXPIRED');
    }

    throw createError('INVALID_TOKEN', { name: err.name, message: err.message });
  }
};
