import type { NextApiRequest, NextApiResponse } from 'next';
import { withErrorHandler } from '@utils/with-error-handler';
import { COOKIE_KEY_REDIRECT_URL } from '@defines/cookie';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const redirectTo = req.cookies[COOKIE_KEY_REDIRECT_URL] || '/';
    res.setHeader('Set-Cookie', `${COOKIE_KEY_REDIRECT_URL}=; Path=/;`);
    res.redirect(redirectTo);
    return;
  }
};

export default withErrorHandler(handler);
