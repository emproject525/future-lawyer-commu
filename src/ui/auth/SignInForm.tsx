'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { useMutation } from '@tanstack/react-query';
import client from '@/services/client';
import { IRes } from '@/types';
import { AxiosError } from 'axios';
import Form from '@/components/Input/Form';

/**
 * 로그인폼 (백업용 삭제 예정)
 * @returns
 */
const SignInForm: React.FC<{}> = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate, isPending } = useMutation<
    IRes<string>,
    AxiosError,
    { email: string; password: string }
  >({
    mutationKey: [email, password],
    mutationFn: (body) => {
      const formData = new FormData();
      formData.append('email', body.email);
      formData.append('password', body.password);
      return client.post(`/auth/signin`, formData).then((res) => res.data);
    },
    onSuccess: (res) => {
      if (res.header.success) {
        router.back();
        router.refresh();
      } else {
        alert(res.body);
      }
    },
  });

  return (
    <Form
      onSubmit={() => {
        //
      }}
    >
      <div className="mb-3">
        <label htmlFor="email">이메일</label>
        <Input
          name="email"
          id="email"
          size="lg"
          onlyBorderBottom
          autoComplete="home email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          placeholder="email@example.com"
        />
      </div>
      <div>
        <label htmlFor="password">비밀번호</label>
        <Input
          name="password"
          id="password"
          type="password"
          size="lg"
          onlyBorderBottom
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
        />
      </div>

      <div className="mt-3">
        <Button
          block
          disabled={isPending}
          onClick={() => {
            mutate({ email, password });
          }}
        >
          로그인
        </Button>
      </div>
    </Form>
  );
};

export default SignInForm;
