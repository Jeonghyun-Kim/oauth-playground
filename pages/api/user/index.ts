import type { NextApiRequest, NextApiResponse } from 'next';
import { withErrorHandler } from '@utils/with-error-handler';
import { verifySession } from '@lib/server/verify-session';
import { connectMongo } from '@utils/connect-mongo';
import { User } from 'types/user';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const userId = verifySession(req, res, { renewSession: true });

    const { db } = await connectMongo();

    const user = await db.collection<User>('user').findOne(
      {
        _id: userId,
      },
      {
        projection: {
          _id: 1,
          name: 1,
          email: 1,
          profileUrl: 1,
        },
      },
    );

    return res.json(user);
  }
};

export default withErrorHandler(handler);
