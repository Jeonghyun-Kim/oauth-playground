import type { NextApiRequest, NextApiResponse } from 'next';
import { withErrorHandler } from '@utils/with-error-handler';
import { verifySession } from '@lib/server/verify-session';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const userId = verifySession(req, res);
    return res.json({ userId });
  }
};

export default withErrorHandler(handler);
