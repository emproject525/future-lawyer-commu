import { headers } from 'next/headers';
import Modal from '@/components/Modal/Modal';
import LogoutForm from '@/ui/auth/LogoutForm';

async function getData() {
  'use server';

  const referer = headers().get('referer');

  return { referer };
}

export default async function Page() {
  const { referer } = await getData();

  return (
    <Modal>
      <LogoutForm redirectTo={referer || '/'} />
    </Modal>
  );
}
