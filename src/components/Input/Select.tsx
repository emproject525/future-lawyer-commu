'use client';

import React from 'react';
import clsx from 'clsx';
import styles from '@/styles/input.module.scss';

export type SelectProps<ValueType = string> = {
  options: { label: string; value: ValueType }[];
  onChange?: (selected: ValueType) => void;
  placeholder?: string;
} & Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'children' | 'onChange'
>;

const Select = <ValueType,>({
  options,
  onChange,
  placeholder,
  className,
  ...rest
}: SelectProps<ValueType>) => {
  return (
    <select
      {...rest}
      className={clsx(styles.select, className)}
      onChange={
        onChange
          ? (evt) => {
              const target = options.find(
                (i) => String(i.value) === evt.target.value,
              );
              if (target) {
                onChange(target.value);
              }
            }
          : undefined
      }
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={String(option.value)} value={String(option.value)}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
