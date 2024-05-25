'use client';

import React from 'react';
import Link from 'next/link';
import { FaRegCircleUser } from 'react-icons/fa6';
import FlexBox from '@/components/Box/FlexBox';
import styles from '@/styles/layout.module.scss';
import Logout from '../auth/Logout';

const Actions = () => {
  return (
    <FlexBox className={styles.actions}>
      <Logout>
        <Link href="/auth/signin" title="로그인">
          <FaRegCircleUser />
        </Link>
      </Logout>
    </FlexBox>
  );
};

export default Actions;
