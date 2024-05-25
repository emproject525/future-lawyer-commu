'use client';

import React from 'react';

export type FormProps = {
  onSubmit?: (target: HTMLFormElement) => void | Promise<void>;
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>;

const Form: React.FC<FormProps> = ({ children, onSubmit, ...rest }) => {
  return (
    <form
      {...rest}
      onSubmit={
        onSubmit
          ? async (evt: React.FormEvent<HTMLFormElement>) => {
              evt.preventDefault();
              onSubmit(evt.target as HTMLFormElement);
            }
          : undefined
      }
    >
      {children}
    </form>
  );
};

export default Form;
