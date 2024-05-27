'use client';

import React, { PropsWithChildren } from 'react';
import { useSession } from 'next-auth/react';

const AuthWrapper: React.FC<
  PropsWithChildren<{
    /**
     * 로그인 시 노출
     */
    needLogin?: boolean;
    /**
     * 비로그인 시 노출
     */
    noLogin?: boolean;
  }>
> = ({ children, needLogin, noLogin }) => {
  const { status } = useSession();

  if (needLogin && status === 'authenticated') {
    return children;
  }

  if (noLogin && status === 'unauthenticated') {
    return children;
  }

  return null;
};

export default AuthWrapper;
