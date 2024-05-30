'use client';

import React from 'react';
import Link from 'next/link';
import { FaRegCircleUser } from 'react-icons/fa6';
import { MdLogout } from 'react-icons/md';
import FlexBox from '@/components/Box/FlexBox';
import styles from '@/styles/layout.module.scss';
import AuthWrapper from '../auth/AuthWrapper';

const Actions = () => {
  return (
    <FlexBox className={styles.actions}>
      <AuthWrapper noLogin>
        <Link href="/signin" title="로그인" scroll={false}>
          <FaRegCircleUser />
        </Link>
      </AuthWrapper>
      <AuthWrapper needLogin>
        <Link href="/signout" title="로그아웃" scroll={false}>
          <MdLogout />
        </Link>
      </AuthWrapper>
    </FlexBox>
  );
};

export default Actions;
