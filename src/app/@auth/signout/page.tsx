// import SignInForm from '@/ui/auth/SignInForm';

import Link from 'next/link';
import FlexBox from '@/components/Box/FlexBox';
import Button from '@/components/Button/Button';
import Span from '@/components/Font/Span';
import Form from '@/components/Input/Form';
import Modal from '@/components/Modal/Modal';
import { signOut } from '@/auth';
// import SignInForm from '@/ui/auth/SignInForm';

export default async function Page() {
  return (
    <Modal>
      <Form
        action={async () => {
          'use server';
          await signOut({
            redirectTo: '/',
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
