// import SignInForm from '@/ui/auth/SignInForm';

import { headers } from 'next/headers';
import FlexBox from '@/components/Box/FlexBox';
import Button from '@/components/Button/Button';
import Span from '@/components/Font/Span';
import Form from '@/components/Input/Form';
import { signOut } from '@/auth';

export default async function Page() {
  const headersList = headers();
  const referer = headersList.get('referrer');

  console.log(referer);

  return (
    <Form
      action={async () => {
        'use server';
        await signOut({
          redirectTo: referer || '/',
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
}
