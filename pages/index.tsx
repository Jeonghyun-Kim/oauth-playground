import React from 'react';
import cn from 'classnames';
import { signIn, signout, useSession } from 'next-auth/client';

import { Button } from '@components/ui';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' as const;

export default function IndexPage() {
  const [session, loading] = useSession();

  if (loading) return <div>loading...</div>;

  return (
    <div className="mx-auto max-w-screen-lg pt-4">
      <h4>Signin Info</h4>
      <p>{JSON.stringify(session)}</p>

      <h6 className="font-serif">Serif Font</h6>
      <p className="font-serif">{LOREM}</p>

      <h6 className="font-sans">Poppins Font</h6>
      <p className="font-sans">{LOREM}</p>

      <div className="mt-4">
        <Button
          className={cn(
            {
              hidden: session,
            },
            'mr-4',
          )}
          onClick={() => signIn()}
        >
          Signin
        </Button>
        <Button className={cn({ hidden: !session })} onClick={() => signout()}>
          Signout
        </Button>
      </div>
    </div>
  );
}
