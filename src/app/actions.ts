'use server';

import { cookies } from 'next/headers';

async function renew() {
  const cookieStore = cookies();

  if (cookieStore.has('refreshToken') && !cookieStore.has('accessToken')) {
    // 갱신
  }
}
