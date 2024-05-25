'use client';

import React from 'react';
import clsx from 'clsx';
import styles from '@/styles/contens.module.scss';

const Hr: React.FC<{}> = () => <hr className={clsx('my-2', styles.horizon)} />;

export default Hr;
