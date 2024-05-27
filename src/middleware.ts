import { NextResponse } from 'next/server';
import { auth } from './auth';

export const middleware = auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  // const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  const headers = new Headers(req.headers);
  headers.set('x-pathname', req.nextUrl.pathname);
  headers.set('x-referrer', req.referrer);

  // if (isPublicRoute && isAuthenticated)
  //   return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));

  // if (!isAuthenticated && !isPublicRoute)
  //   return Response.redirect(new URL(ROOT, nextUrl));

  return NextResponse.next({
    request: {
      headers,
    },
  });
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
