'use client';

import React from 'react';
import { ImSpinner } from 'react-icons/im';
import styles from '@/styles/contens.module.scss';

const Spinner: React.FC<{}> = () => <ImSpinner className={styles.spin} />;

export default Spinner;
