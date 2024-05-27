import Button from '@/components/Button/Button';
import Form from '@/components/Input/Form';
import Input from '@/components/Input/Input';
// import { signIn } from 'next-auth/react';
import { signIn } from '@/auth';

const LoginForm = () => {
  return (
    <Form
      action={async (formData) => {
        'use server';
        await signIn('credentials', formData);
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
        />
      </div>

      <div className="mt-3">
        <Button block type="submit">
          로그인
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
