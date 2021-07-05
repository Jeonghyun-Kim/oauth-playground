import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { verifyToken } from '@utils/jsonwebtoken';
import { COOKIE_KEY_ACCESS_TOKEN, COOKIE_KEY_REDIRECT_URL } from '@defines/cookie';
import { createError } from '@defines/errors';

export function verifySession(req: NextApiRequest, res: NextApiResponse): ObjectId {
  const accessToken = req.cookies[COOKIE_KEY_ACCESS_TOKEN];

  if (!accessToken) {
    res.status(401);
    throw createError('TOKEN_EMPTY');
  }

  try {
    const { userId } = verifyToken(accessToken);
    return new ObjectId(userId);
  } catch (err) {
    res.status(401);
    if (err.code === 'AE001') {
      res.setHeader('Set-Cookie', `${COOKIE_KEY_REDIRECT_URL}=${req.headers.referer ?? '/'}`);
    }

    throw err;
  }
}
