import { NextResponse } from 'next/server';
import { QueryError } from 'mysql2';
import { transaction } from '@/db/pool';
import { catchRouteError, getCredentialsHeaders } from '@/utils';
import { AuthError } from 'next-auth';
import { auth } from '@/auth';

export async function OPTIONS(req: Request) {
  return Response.json({});
}

/**
 * `POST` `게시글` 등록
 * - Crendetials
 * @param req NextRequest
 * @returns Response
 */
export const POST = auth(async (req) => {
  let message = '';
  let status = 200;
  let success = false;

  const headers = getCredentialsHeaders();

  try {
    const payload: {
      title: string;
      body: string;
      categorySeq: number;
    } = await req.json();

    // const ip = (req.headers.get('X-Forwarded-For') ?? '127.0.0.1').split(',')[0];
    const ip = req.ip ?? '127.0.0.1';

    if (!req.auth) throw new AuthError();

    await transaction(
      `insert into contents(title, user_seq, reg_dt, reg_ip, category_seq) values ('${payload.title}', ${req.auth.user.seq}, now(), '${ip}', ${payload.categorySeq});`,
      `insert into contents_body(body, contents_seq) values ('${payload.body}', (select seq from contents where user_seq=1 order by seq desc limit 1));`,
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
    return NextResponse.json(
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
