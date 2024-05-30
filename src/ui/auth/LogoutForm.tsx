import Button from '@/components/Button/Button';
import Form from '@/components/Input/Form';
import FlexBox from '@/components/Box/FlexBox';
import Span from '@/components/Font/Span';
import { signOut } from '@/auth';

type LogoutFormProps = {
  redirectTo?: string;
};

const LogoutForm: React.FC<LogoutFormProps> = ({ redirectTo }) => {
  return (
    <Form
      action={async () => {
        'use server';
        await signOut({
          redirectTo: redirectTo || '/',
          redirect: true,
        });
      }}
    >
      <FlexBox className="mb-3 px-5">
        <Span>로그아웃 하시겠습니까?</Span>
      </FlexBox>
      <Button block size="lg" type="submit">
        Logout
      </Button>
    </Form>
  );
};

export default LogoutForm;
