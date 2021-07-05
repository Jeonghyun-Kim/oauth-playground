import React from 'react';
import cn from 'classnames';

import { Button } from '@components/ui';
import { useRouter } from 'next/router';
import { COOKIE_KEY_ACCESS_TOKEN } from '@defines/cookie';
import { fetcher } from '@lib/fetcher';

export default function IndexPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-screen-lg pt-4">
      <div className="space-x-4">
        <Button
          onClick={() => {
            document.cookie = `${COOKIE_KEY_ACCESS_TOKEN}=${router.asPath};`;
            router.push('/api/oauth/provider/github');
          }}
        >
          signin
        </Button>
        <Button
          onClick={() => {
            fetcher('/api/auth').then(({ userId }) => alert(`userId: ${userId}`));
          }}
        >
          check session
        </Button>
      </div>
    </div>
  );
}
