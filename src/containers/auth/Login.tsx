'use client';

import React, { useState, useEffect, PropsWithChildren } from 'react';
import { getSavedAccessToken } from '@/utils';

/**
 * 로그인되었을 때만 노출
 */
const Login: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!!getSavedAccessToken());
  }, []);

  if (!show) {
    return null;
  }

  return children;
};

export default Login;
