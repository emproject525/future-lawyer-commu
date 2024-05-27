'use client';

import React, { PropsWithChildren } from 'react';
import styles from '@/styles/modal.module.scss';

export type BackdropProps = {};

/**
 * Backdrop
 * @param param0
 * @returns
 */
const Backdrop: React.FC<PropsWithChildren<BackdropProps>> = ({ children }) => {
  return <div className={styles.backdrop}>{children}</div>;
};

export default Backdrop;
