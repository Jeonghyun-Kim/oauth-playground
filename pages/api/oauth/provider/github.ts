import type { NextApiRequest, NextApiResponse } from 'next';
import qs from 'qs';
import { withErrorHandler } from '@utils/with-error-handler';
import { signToken } from '@utils/jsonwebtoken';

const client_id = process.env.GITHUB_ID;
if (!client_id) throw new Error('Missing GITHUB_ID');

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('Missing JWT_SECRET');

const SERVER_URL = process.env.SERVER_URL;
if (!SERVER_URL) throw new Error('Missing SERVER_URL');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const ourStateToken = signToken({}, { expiresIn: '1m' });

    const requestOptions = {
      client_id,
      redirect_uri: `${SERVER_URL}/api/oauth/callback/github`,
      state: ourStateToken,
    };

    res.redirect(`https://github.com/login/oauth/authorize?${qs.stringify(requestOptions)}`);
    return;
  }
};

export default withErrorHandler(handler);
