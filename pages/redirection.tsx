import React, { useEffect } from 'react';

import { useRouter } from 'next/router';

export default function RedirectionPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectTo = sessionStorage.getItem('redirectTo');

    router.replace(redirectTo ?? '/');
  }, [router]);

  return <div>redirecting...</div>;
}
