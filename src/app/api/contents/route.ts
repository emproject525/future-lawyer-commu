import { auth } from '@/auth';
import { select, transaction } from '@/db/pool';
import { IContentsTableRow } from '@/types';
import { catchRouteError, getCredentialsHeaders } from '@/utils';
import { QueryError } from 'mysql2';
import { AuthError } from 'next-auth';
import { NextResponse } from 'next/server';

/**
 * `GET` `게시글` 목록
 * @see https://jeong-pro.tistory.com/244
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paramPage = Number(searchParams.get('page') ?? 1);
  const paramCount = Number(searchParams.get('count') ?? 20);
  const paramCateMain = Number(searchParams.get('m') ?? 0);
  const paramCateSeq = Number(searchParams.get('c') ?? 0);

  // const id = searchParams.get('id');
  // const res = await fetch(`https://data.mongodb-api.com/product/${id}`, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'API-Key': process.env.DATA_API_KEY!,
  //   },
  // });
  // const product = await res.json();

  let success = false;
  let list: IContentsTableRow[] = [];

  const wherePhrase = [
    paramCateSeq > 0 && `where c.category_seq=${paramCateSeq}`,
    paramCateMain > 0 && `where cate.main=${paramCateMain}`,
  ]
    .filter(Boolean)
    .join('');

  await select<IContentsTableRow>(
    `select c.seq, c.title, (select count(*) from comment where comment.contents_seq = c.seq && comment.parent_seq is NULL) as comment_cnt,
    case 
      when DATE(c.reg_dt) = CURDATE()
      then DATE_FORMAT(c.reg_dt, '%H:%i')
      else DATE_FORMAT(c.reg_dt, '%m-%d') end as reg_dt,
    cate.sub_name as sub_name
    from contents c
    inner join contents_category cate on c.category_seq = cate.seq ${wherePhrase}
    where c.del_yn = 'N'
    order by c.seq desc 
    limit ${(paramPage - 1) * paramCount}, ${paramCount};`,
  ).then((res) => {
    success = true;
    list = res;
  });

  let count = 0;
  await select<{
    cnt: number;
  }>(`
  select count(*) as cnt
  from contents c inner join contents_category cate
  on c.category_seq = cate.seq ${wherePhrase};`).then(
    (res) => {
      count = res[0]?.cnt || 0;
    },
    () => {
      success = false;
    },
  );

  return NextResponse.json({
    header: {
      status: 200,
      success: true,
    },
    body: {
      list,
      count,
    },
  });
}

export async function OPTIONS(req: Request) {
  return Response.json({});
}

/**
 * `POST` `게시글` 등록
 * - Crendetials
 * @param req NextAuthRequest
 * @returns NextResponse
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
