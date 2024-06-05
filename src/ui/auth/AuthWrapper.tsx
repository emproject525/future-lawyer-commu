'use client';

import React, { PropsWithChildren } from 'react';
// import { useSession } from 'next-auth/react';
import AppSessionContext from './AppSessionContext';

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
    /**
     * 회원 seq가 동일한 경우에만 노출 (로그인 상태 전제)
     */
    userSeq?: number;
  }>
> = ({ children, needLogin, noLogin, userSeq }) => {
  return (
    <AppSessionContext.Consumer>
      {({ status, data }) => {
        if (userSeq && data?.user?.seq === userSeq) {
          return children;
        }

        if (needLogin && status === 'authenticated') {
          return children;
        }

        if (noLogin && status === 'unauthenticated') {
          return children;
        }

        return null;
      }}
    </AppSessionContext.Consumer>
  );

  // const { status } = useSession();

  // if (needLogin && status === 'authenticated') {
  //   return children;
  // }

  // if (noLogin && status === 'unauthenticated') {
  //   return children;
  // }

  // return null;
};

export default AuthWrapper;
