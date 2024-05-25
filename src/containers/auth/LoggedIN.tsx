'use client';

import { getSavedAccessToken } from '@/utils';
import React, { useState, useEffect } from 'react';

type LoggedInProps = {
  children?: React.ReactNode;
};

/**
 * 로그인되었을 때만 노출
 */
const LoggedIn = ({ children }: LoggedInProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!!getSavedAccessToken());
  }, []);

  if (!show) {
    return null;
  }

  return children;
};

export default LoggedIn;
