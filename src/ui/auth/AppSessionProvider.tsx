'use client';

import type { Session } from 'next-auth';
import { SessionProvider, getSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, useState, useCallback, useEffect } from 'react';

/**
 * @see https://github.com/nextauthjs/next-auth/issues/10016#issuecomment-1985081720
 * @param param0
 * @returns
 */
const AppSessionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const pathName = usePathname();

  const fetchSession = useCallback(async () => {
    try {
      const sessionData = await getSession();
      setSession(sessionData);
    } catch (error) {
      setSession(null);

      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    fetchSession().finally();
  }, [fetchSession, pathName]);

  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default AppSessionProvider;
