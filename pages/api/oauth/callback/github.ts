import type { NextApiRequest, NextApiResponse } from 'next';
import { withErrorHandler } from '@utils/with-error-handler';
import { verifyToken } from '@utils/jsonwebtoken';
import { isString } from '@utils/validator/common';
import { createError } from '@defines/errors';
import { connectMongo } from '@utils/connect-mongo';

// types
import { User } from 'types/user';

const client_id = process.env.GITHUB_ID;
if (!client_id) throw new Error('Missing GITHUB_ID');

const client_secret = process.env.GITHUB_SECRET;
if (!client_secret) throw new Error('Missing GITHUB_SECRET');

const SERVER_URL = process.env.SERVER_URL;
if (!SERVER_URL) throw new Error('Missing SERVER_URL');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { code, state } = req.query;

    if (!isString(state)) {
      throw createError('VALIDATION_FAILED', {
        message: `Invalid type of query parameter \`state\`. expected: string, received: ${typeof state}`,
      });
    }
    // Check validity of the request
    verifyToken(state);

    let response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
        redirect_uri: `${SERVER_URL}/api/oauth/callback/github`,
        state,
      }),
    });

    if (!response.ok) {
      throw createError('INTERNAL_SERVER_ERROR', {
        name: 'Github callback - access_token',
        message: await response.text(),
      });
    }

    const { access_token, expires_in, refresh_token, refresh_token_expires_in } =
      await response.json();

    response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    if (!response.ok) {
      throw createError('INTERNAL_SERVER_ERROR', {
        name: 'Github callback - user info',
        message: await response.text(),
      });
    }

    const { id, name, email, avatar_url } = await response.json();

    const { db } = await connectMongo();

    const exUser = await db.collection<User>('user').findOne({ email });

    if (!exUser) {
      // create account with github.
      const { insertedId } = await db.collection<User>('user').insertOne({
        name,
        email,
        password: null,
        connectedAccounts: [
          {
            provider: 'github',
            providerAccountId: id,
            accessToken: access_token,
            accessTokenExpires: new Date(Date.now() + expires_in),
            refreshToken: refresh_token,
            refreshTokenExpires: new Date(Date.now() + refresh_token_expires_in),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        profileUrl: avatar_url,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // TODO: set accessToken on response cookie?

      res.redirect('/redirection');
      return;
    }

    if (exUser.connectedAccounts.map(({ provider }) => provider).includes('github')) {
      await db.collection<User>('user').updateOne(
        {
          _id: exUser._id,
          connectedAccounts: { $elemMatch: { provider: { $eq: 'github' } } },
        },
        {
          $set: {
            'connectedAccounts.$.accessToken': access_token,
            'connectedAccounts.$.accessTokenExpires': new Date(Date.now() + expires_in),
            'connectedAccounts.$.refreshToken': refresh_token,
            'connectedAccounts.$.refreshTokenExpires': new Date(
              Date.now() + refresh_token_expires_in,
            ),
            'connectedAccounts.$.updatedAt': new Date(),
          },
        },
      );
    } else {
      await db.collection<User>('user').updateOne(
        {
          _id: exUser._id,
        },
        {
          $push: {
            connectedAccounts: {
              provider: 'github',
              providerAccountId: id,
              accessToken: access_token,
              accessTokenExpires: new Date(Date.now() + expires_in),
              refreshToken: refresh_token,
              refreshTokenExpires: new Date(Date.now() + refresh_token_expires_in),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        },
      );
    }

    // TODO: set accessToken on response cookie?

    res.redirect('/redirection');
    return;
  }
};

export default withErrorHandler(handler);
