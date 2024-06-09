'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/typing.module.scss';
import { onceAgain } from '@/services/lyrics';

const TypingBackground = () => {
  const [fullTexts, setFullTexts] = useState<Record<number, string[]>>({});

  useEffect(() => {
    setFullTexts(
      onceAgain.split('\n').reduce((all, cur, idx) => {
        const copied: typeof fullTexts = { ...all };
        copied[idx] = cur.split('');
        return copied;
      }, {}),
    );
  }, []);

  return (
    <div className={styles.relative_box}>
      <div className={styles.typing} contentEditable></div>
      <div className={styles.typing_bg}>{onceAgain}</div>
    </div>
  );
};

export default TypingBackground;
