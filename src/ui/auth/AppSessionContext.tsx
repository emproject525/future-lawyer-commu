'use client';

import React, {
  useState,
  useCallback,
  useEffect,
  PropsWithChildren,
} from 'react';
import { usePathname } from 'next/navigation';
import { getSession } from 'next-auth/react';
import type { Session } from 'next-auth';

type ContextValue = {
  data: Session | null;
  status: 'authenticated' | 'unauthenticated' | 'loading';
};

const defaultContextValue: ContextValue = { data: null, status: 'loading' };

const AppSessionContext =
  React.createContext<ContextValue>(defaultContextValue);

export const AppSessionProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [session, setSession] = useState<ContextValue>(defaultContextValue);
  const pathName = usePathname();

  const fetchSession = useCallback(async () => {
    try {
      const sessionData = await getSession();
      setSession({
        status: sessionData ? 'authenticated' : 'unauthenticated',
        data: sessionData,
      });
    } catch (error) {
      setSession(defaultContextValue);

      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    fetchSession().finally();
  }, [fetchSession, pathName]);

  return (
    <AppSessionContext.Provider value={session}>
      {children}
    </AppSessionContext.Provider>
  );
};

export default AppSessionContext;
