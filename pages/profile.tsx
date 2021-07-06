import React from 'react';
import NextLink from 'next/link';
import NextImage from 'next/image';

import { Button } from '@components/ui';
import useSession from '@lib/hooks/use-session';

export default function ProfilePage() {
  const { user, loading } = useSession({ redirectTo: '/signin' });

  if (loading || !user) return <div>loading...</div>;

  return (
    <div className="mx-auto max-w-screen-lg pt-4">
      <div className="space-x-4">
        <NextLink href="/" passHref>
          <Button as="a">Back to Home</Button>
        </NextLink>
        <NextLink href="/api/signout" passHref>
          <Button as="a">Signout</Button>
        </NextLink>
      </div>
      <div>
        {user.profileUrl ? (
          <NextImage
            className="w-[300px] h-[300px] rounded-full bg-gradient-to-br from-gray-500 to-blue-500"
            src={user.profileUrl}
            layout="fixed"
            width={300}
            height={300}
            unoptimized
          />
        ) : (
          <span className="w-[300px] h-[300px] rounded-full bg-gradient-to-br from-gray-500 to-blue-500" />
        )}
        <h4>{user.name}</h4>
        <p>{user.email}</p>
      </div>
    </div>
  );
}
