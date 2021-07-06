import React from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { Button } from '@components/ui';

import useSession from '@lib/hooks/use-session';

export default function SigninPage() {
  const router = useRouter();
  useSession({ redirectIfFound: true });

  return (
    <div className="mx-auto max-w-screen-lg pt-4">
      <div className="space-x-4">
        <Button
          onClick={() => {
            router.push('/api/oauth/provider/github');
          }}
        >
          signin with github
        </Button>
        <NextLink href="/" passHref>
          <Button as="a">Back to Home</Button>
        </NextLink>
      </div>
    </div>
  );
}
