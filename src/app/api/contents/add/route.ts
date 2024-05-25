import { NextRequest, NextResponse } from 'next/server';
import { QueryError } from 'mysql2';
import { transaction } from '@/db/pool';
import { decodeToken } from '@/utils';

export async function OPTIONS(req: Request) {
  return Response.json({});
}

export async function POST(req: NextRequest) {
  let message = '';
  let status = 200;
  let success = false;

  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  headers.set('Access-Control-Allow-Credentials', 'true');

  try {
    const payload: {
      title: string;
      body: string;
      categorySeq: number;
    } = await req.json();

    // const ip = (req.headers.get('X-Forwarded-For') ?? '127.0.0.1').split(',')[0];
    const ip = req.ip ?? '127.0.0.1';
    const token = req.headers.get('Authorization');

    if (!token) throw '요청헤더에 토큰없음';

    const { decoded, error } = await decodeToken(token);

    if (!!error) throw error.message;

    if (decoded > 0) {
      await transaction(
        `insert into contents(title, user_seq, reg_dt, reg_ip, category_seq) values ('${payload.title}', ${decoded}, now(), '${ip}', ${payload.categorySeq});`,
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
    }
  } catch (e) {
    success = false;
    status = 500;
    message = typeof e === 'string' ? e : 'Network Error';
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
}
