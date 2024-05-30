import Button from '@/components/Button/Button';
import Form from '@/components/Input/Form';
import Input from '@/components/Input/Input';
import { signIn, unstable_update } from '@/auth';

type LoginFormProps = {
  redirectTo?: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ redirectTo }) => {
  return (
    <Form
      action={async (formData) => {
        'use server';
        const session = await signIn('credentials', {
          redirect: true,
          redirectTo: redirectTo || '/',
          email: formData.get('email'),
          password: formData.get('password'),
        });

        unstable_update(session);

        // redirect(redirectTo || '/', RedirectType.push);
      }}
    >
      <div className="mb-3">
        <label htmlFor="email">이메일</label>
        <Input
          name="email"
          id="email"
          size="lg"
          onlyBorderBottom
          autoComplete="email"
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
        <Button block type="submit" size="lg">
          로그인
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
