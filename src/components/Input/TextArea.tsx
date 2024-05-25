'use client';

import React from 'react';
import clsx from 'clsx';
import styles from '@/styles/input.module.scss';

export type TextAreaProps = {
  error?: boolean;
  disabled?: boolean;
  onlyBorderBottom?: boolean;
  /**
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
} & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'disabled' | 'size'
>;

const TextArea: React.FC<TextAreaProps> = ({
  error,
  disabled,
  size,
  onlyBorderBottom,
  ...rest
}: TextAreaProps) => {
  return (
    <textarea
      disabled={disabled}
      aria-disabled={disabled}
      className={clsx(styles.input, styles.textarea, {
        [styles.input_disabled]: disabled,
        [styles.input_error]: error,
        [styles.input_lg]: size === 'lg',
        [styles.input_border_bottom]: onlyBorderBottom,
      })}
      {...rest}
    />
  );
};

export default TextArea;
