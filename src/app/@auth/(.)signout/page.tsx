// import SignInForm from '@/ui/auth/SignInForm';

import { headers } from 'next/headers';
import FlexBox from '@/components/Box/FlexBox';
import Button from '@/components/Button/Button';
import Span from '@/components/Font/Span';
import Form from '@/components/Input/Form';
import Modal from '@/components/Modal/Modal';
import { signOut } from '@/auth';

async function getData() {
  'use server';

  const referer = headers().get('referer');

  return { referer };
}

export default async function Page() {
  const { referer } = await getData();

  return (
    <Modal>
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
    </Modal>
  );
}
