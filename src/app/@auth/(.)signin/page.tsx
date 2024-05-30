// import SignInForm from '@/ui/auth/SignInForm';

import { headers } from 'next/headers';
import Modal from '@/components/Modal/Modal';
import LoginForm from '@/ui/auth/LoginForm';
// import SignInForm from '@/ui/auth/SignInForm';

async function getData() {
  'use server';

  const referer = headers().get('referer');

  return { referer };
}

export default async function Page() {
  const { referer } = await getData();

  return (
    <Modal>
      <LoginForm redirectTo={referer || '/'} />
    </Modal>
  );
}
