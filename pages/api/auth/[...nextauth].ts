import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  database: process.env.DATABASE_URL,
  secret: process.env.SECRET,

  session: {
    jwt: true,
    maxAge: 14 * 24 * 60 * 60, // 14 days
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    // encryption: true,
    // encryptionKey: process.env.JWT_ENCRYPTION_KEY,
  },
});
