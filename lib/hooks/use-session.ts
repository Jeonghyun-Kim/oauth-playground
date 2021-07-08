import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import cookie from 'cookie';

// types
import { UserInfo } from 'types/user';
import { COOKIE_KEY_REDIRECT_URL } from '@defines/cookie';

interface UseSessionOptions {
  savePath?: boolean;
  redirectTo?: string;
  redirectAs?: string;
  redirectIfFound?: boolean;
}

const defaultOptions: UseSessionOptions = {
  savePath: true,
  redirectIfFound: false,
};

export default function useSession({
  savePath = defaultOptions.savePath,
  redirectTo,
  redirectAs,
  redirectIfFound = defaultOptions.redirectIfFound,
}: UseSessionOptions = defaultOptions) {
  const router = useRouter();

  const {
    data: user,
    mutate,
    error,
  } = useSWR<UserInfo>('/api/user', {
    refreshInterval: 300000,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (!user && !error) return;

    if (user && redirectIfFound) {
      router.replace(cookie.parse(document.cookie)[COOKIE_KEY_REDIRECT_URL] || '/');
    } else if (!user && redirectTo && !redirectIfFound) {
      if (savePath) {
        document.cookie = `${COOKIE_KEY_REDIRECT_URL}=${router.asPath}; Path=/`;
      }

      router.replace(redirectTo, redirectAs);
    }
  }, [user, error, redirectTo, redirectAs, redirectIfFound, savePath, router]);

  return {
    loading: !user && !error,
    user,
    error,
    mutate,
  };
}
