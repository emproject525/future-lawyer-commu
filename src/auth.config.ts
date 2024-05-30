import type { NextAuthConfig, User } from 'next-auth';
import { IUser } from './types';
import { AdapterUser } from 'next-auth/adapters';

export const authConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
  // callbacks: {
  //   authorized({ auth }) {
  //     const isAuthenticated = !!auth?.user;
  //     return isAuthenticated;
  //   },
  // },
  callbacks: {
    async session({ session, token, user }) {
      session.user = token.user as AdapterUser & User;
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user;
      }
      // ***************************************************************
      // added code
      if (
        (trigger === 'update' ||
          trigger === 'signIn' ||
          trigger === 'signUp') &&
        session
      ) {
        token = { ...token, user: session };
        return token;
      }
      // **************************************************************
      return token;
    },
  },

  providers: [],
} satisfies NextAuthConfig;
