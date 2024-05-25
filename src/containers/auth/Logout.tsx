'use client';

import React, { useState, useEffect, PropsWithChildren } from 'react';
import { getSavedAccessToken } from '@/utils';

/**
 * 로그아웃 상태일 때만 노출
 */
const Logout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!getSavedAccessToken());
  }, []);

  if (!show) {
    return null;
  }

  return children;
};

export default Logout;
