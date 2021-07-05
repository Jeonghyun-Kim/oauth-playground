import { ObjectId } from 'mongodb';

const OAUTH_PROVIDERS = ['github', 'google'] as const;
type OAuthProvider = typeof OAUTH_PROVIDERS[number];

interface OAuthAccount {
  provider: OAuthProvider;
  providerAccountId: number | string;
  accessToken: string;
  accessTokenExpires: Date | string | null;
  refreshToken: string;
  refreshTokenExpires: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface User {
  _id: ObjectId | string;
  name: string;
  email: string;
  profileUrl: string | null;
  password: string | null;
  connectedAccounts: OAuthAccount[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export {};
