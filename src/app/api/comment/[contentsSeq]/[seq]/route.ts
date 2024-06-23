import { NextRequest } from 'next/server';
import execute from '@/db/pool';
import { catchRouteError, getCredentialsHeaders } from '@/utils';
import { AuthError } from 'next-auth';
import { QueryError } from 'mysql2';
import { auth } from '@/auth';

/**
 * `OPTIONS`
 */
export async function OPTIONS(req: Request) {
  return Response.json({});
}

/**
 * `POST` `댓글`/`답글` 수정
 * - Credentials
 */
export const POST = auth(async (req, ctx) => {
  let message = '';
  let status = 200;
  let success = false;

  const headers = getCredentialsHeaders();

  try {
    const payload: {
      body: string;
    } = await req.json();

    if (!req.auth) throw new AuthError();

    // const contentsSeq = ctx.params?.contentsSeq;
    const seq = ctx.params?.seq;

    await execute(
      `update comment set body='${payload.body || ''}' where seq=${seq};`,
    ).then(
      () => {
        success = true;
      },
      (err: QueryError | string | null) => {
        success = false;

        if (typeof err === 'string') {
          message = err;
        } else if (err) {
          message = err.message;
        }
      },
    );
  } catch (e) {
    const info = catchRouteError(e);
    success = info.success;
    status = info.status;
    message = info.message;
  } finally {
    return Response.json(
      {
        header: {
          status,
          success,
          message,
        },
        body: success,
      },
      {
        headers,
      },
    );
  }
});
