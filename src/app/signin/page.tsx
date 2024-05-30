import LoginForm from '@/ui/auth/LoginForm';
import { headers } from 'next/headers';

async function getData() {
  'use server';

  const referer = headers().get('referer');

  return { referer };
}

export default async function Page() {
  const { referer } = await getData();

  return (
    <main>
      <LoginForm redirectTo={referer || '/'} />
    </main>
  );
}
