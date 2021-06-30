import React from 'react';
import cn from 'classnames';
import { signIn, signout, useSession } from 'next-auth/client';

import { Button } from '@components/ui';

export default function IndexPage() {
  const [session, loading] = useSession();

  if (loading) return <div>loading...</div>;

  return (
    <div className="mx-auto max-w-screen-lg pt-4">
      <h4>Signin Info</h4>
      <p>{JSON.stringify(session)}</p>

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
