// import SignInForm from '@/ui/auth/SignInForm';

import { headers } from 'next/headers';
import LogoutForm from '@/ui/auth/LogoutForm';

async function getData() {
  'use server';

  const referer = headers().get('referer');

  return { referer };
}

export default async function Page() {
  const { referer } = await getData();

  return (
    <main>
      <LogoutForm redirectTo={referer || '/'} />
    </main>
  );
}
