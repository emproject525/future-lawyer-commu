'use client';

import ReactDOMServer from 'react-dom/server';
import React, { useState, useEffect, useCallback } from 'react';
import Highlighter from 'react-highlight-words';
import styles from '@/styles/typing.module.scss';
import { onceAgain } from '@/services/lyrics';

const TypingBackground = () => {
  const [fullTexts, setFullTexts] = useState<string[]>([]);
  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    // setFullTexts(
    //   onceAgain.split('\n').reduce((all, cur, idx) => {
    //     const copied: typeof fullTexts = { ...all };
    //     copied[idx] = cur.split('');
    //     return copied;
    //   }, {}),
    // );
    setFullTexts(onceAgain.split('\n'));
  }, []);

  const getHighlightHtml = useCallback((origin: string, curValue: string) => {
    const splited = origin.split(' ');

    const htmlString = ReactDOMServer.renderToString(
      <Highlighter
        searchWords={splited.map((txt, idx) =>
          idx === splited.length - 1 ? txt : `${txt} `,
        )}
        textToHighlight={curValue}
        unhighlightClassName={styles.wrong}
        highlightStyle={{
          background: 'transparent',
        }}
      />,
    );

    return htmlString;
  }, []);

  return (
    <div className={styles.relative_box}>
      {fullTexts.map((p, idx) => (
        <div
          key={`paragraph-${idx}`}
          id={`paragraph-${idx}`}
          className={styles.typing}
          contentEditable
          onBlur={(e) => {
            const newValue = (e.currentTarget.textContent || '').replace(
              /\n/,
              '',
            );
            setValues((before) => {
              const copied = [...before];
              copied[idx] = newValue;
              return copied;
            });
          }}
          data-content={p}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              // 다음 div focus
              document.getElementById(`paragraph-${idx + 1}`)?.focus();
            }
          }}
          dangerouslySetInnerHTML={{
            __html: getHighlightHtml(p, values[idx] || ''),
          }}
        />
      ))}
    </div>
  );
};

export default TypingBackground;
