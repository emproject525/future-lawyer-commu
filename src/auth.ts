import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { Provider } from 'next-auth/providers';
import { authConfig } from '@/auth.config';
import crypto from 'crypto';
import { IUser } from './types';
import { select } from './db/pool';

async function getUser(email: string, password: string): Promise<IUser> {
  const encryption = crypto
    .createHash(process.env.CRYPTO_HASH!)
    .update(password)
    .digest('base64');

  const users = await select<IUser>(
    `select * from user where email='${email}' && password='${encryption}';`,
  );

  return users?.[0] ?? null;
}

/**
 * next-auth providers
 */
const providers: Provider[] = [
  GoogleProvider,
  Credentials({
    name: 'credentials',
    credentials: {
      email: { label: 'email', type: 'text' },
      password: { label: 'password', type: 'password' },
    },
    async authorize(credentials) {
      const user = await getUser(
        credentials.email as string,
        credentials.password as string,
      );

      if (!user) {
        // No user found, so this is their first attempt to login
        // meaning this is also the place you could do registration
        throw new Error('User not found.');
      }

      return user;
    },
  }),
];

/**
 * provider map
 */
export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

/**
 * next-auth
 * @see https://medium.com/@renanleonel/how-to-set-up-nextauth-v5-authentication-with-middleware-and-jest-configuration-in-next-js-14-ca3e64bfb7d5
 */

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
});
