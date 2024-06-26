import Button from '@/components/Button/Button';
import Form from '@/components/Input/Form';
import Input from '@/components/Input/Input';
import { signIn } from '@/auth';

type LoginFormProps = {
  redirectTo?: string;
};

/**
 * 이메일 / PW 입력폼
 * @param param0
 * @returns React.FC
 */
const LoginForm: React.FC<LoginFormProps> = ({ redirectTo }) => {
  return (
    <Form
      action={async (formData) => {
        'use server';
        await signIn('credentials', {
          redirect: true,
          redirectTo: redirectTo || '/',
          email: formData.get('email'),
          password: formData.get('password'),
        });

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
