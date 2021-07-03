import React from 'react';
import cn from 'classnames';

import { Button } from '@components/ui';
import { useRouter } from 'next/router';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' as const;

export default function IndexPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-screen-lg pt-4">
      <Button
        onClick={() => {
          sessionStorage.setItem('redirectTo', router.asPath);
          router.push('/api/oauth/provider/github');
        }}
      >
        signin
      </Button>
    </div>
  );
}
