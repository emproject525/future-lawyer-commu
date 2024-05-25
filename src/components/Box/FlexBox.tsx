'use client';

import React from 'react';
import clsx from 'clsx';
import styles from '@/styles/box.module.scss';

export type FlexBoxProps = {
  /**
   * @default false
   */
  column?: boolean;
  /**
   * @default row
   */
  row?: boolean;
  /**
   * Set Height 100%
   */
  fullHeight?: boolean;
  /**
   * Set Width 100%
   */
  fullWidth?: boolean;
  /**
   * Set align-items flex-start;
   */
  alignItemsStart?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const FlexBox: React.FC<FlexBoxProps> = ({
  children,
  className,
  column,
  row,
  fullWidth,
  fullHeight,
  alignItemsStart,
  ...rest
}) => {
  return (
    <div
      className={clsx(styles.flex_box, className, {
        [styles.full_width]: fullWidth,
        [styles.full_height]: fullHeight,
        [styles.align_items_start]: alignItemsStart,
        [styles.flex_box_column]: column,
        [styles.flex_box_row]: row,
      })}
      {...rest}
    >
      {children}
    </div>
  );
};

export default FlexBox;
