import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { serialize } from 'cookie';
import { signToken, verifyToken } from '@utils/jsonwebtoken';
import {
  COOKIE_KEY_ACCESS_TOKEN,
  COOKIE_KEY_REDIRECT_URL,
  defaultCookieOptions,
} from '@defines/cookie';
import { createError } from '@defines/errors';
import { ACCESS_TOKEN_EXPIRES_IN } from '@defines/token';

interface VerifySessionOptions {
  renewSession?: boolean;
}
export function verifySession(
  req: NextApiRequest,
  res: NextApiResponse,
  options?: VerifySessionOptions,
): ObjectId {
  const accessToken = req.cookies[COOKIE_KEY_ACCESS_TOKEN];

  if (!accessToken) {
    res.status(401);
    throw createError('TOKEN_EMPTY');
  }

  try {
    const { userId } = verifyToken(accessToken);

    if (options?.renewSession) {
      const newAccessToken = signToken(
        { userId: String(userId) },
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
      );
      res.setHeader('Set-Cookie', [
        serialize(COOKIE_KEY_ACCESS_TOKEN, newAccessToken, defaultCookieOptions),
      ]);
    }

    return new ObjectId(userId);
  } catch (err) {
    res.status(401);
    if (err.code === 'AE001') {
      // FIXME: Redirect to session-expired page?
      res.setHeader('Set-Cookie', `${COOKIE_KEY_REDIRECT_URL}=${req.headers.referer ?? '/'}`);
    }

    throw err;
  }
}
