import React from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { Button } from '@components/ui';
import { COOKIE_KEY_REDIRECT_URL } from '@defines/cookie';
import useSession from '@lib/hooks/use-session';

export default function IndexPage() {
  const router = useRouter();
  const { user } = useSession();

  return (
    <div className="mx-auto max-w-screen-lg pt-4">
      <div className="space-x-4">
        <NextLink href="/profile" passHref>
          <Button as="a">My Profile</Button>
        </NextLink>
        {!user && (
          <NextLink href="/signin" passHref>
            <Button
              as="a"
              onClick={() => {
                document.cookie = `${COOKIE_KEY_REDIRECT_URL}=${router.asPath}; Path=/`;
              }}
            >
              Sigin Page
            </Button>
          </NextLink>
        )}
      </div>
    </div>
  );
}
