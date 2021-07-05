import type { NextApiRequest, NextApiResponse } from 'next';
import { withErrorHandler } from '@utils/with-error-handler';
import { isDev } from '@utils/is-development';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    res.setHeader(
      'Set-Cookie',
      `kay.accessToken=; ${isDev() ? '' : 'Secure; '}Path=/; SameSite=Lax; HttpOnly`,
    );
    // FIXME: redirect url 설정?
    res.redirect('/');
  }
};

export default withErrorHandler(handler);
