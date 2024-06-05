import { NextRequest } from 'next/server';
import execute, { select } from '@/db/pool';
import { ICommentParent } from '@/types';
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
 * `GET` 컨텐츠의 `댓글` 목록 조회
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { contentsSeq: number } },
) {
  const { contentsSeq } = params;
  const { searchParams } = new URL(req.url);
  // seq 이전
  const prev = Number(searchParams.get('p') ?? -1);
  // seq 이후
  const next = Number(searchParams.get('n') ?? -1);
  // 가져오는 최대 댓글수
  const max = 100;

  let success = false;
  let list: ICommentParent[] = [];

  // 사용할 때는 역순으로 사용하기 (first_value(p.seq) over (order by p.seq asc) first => where의 seq 조건을 타서 별도로 쿼리)
  await select<ICommentParent>(
    `select p.seq, p.contents_seq, p.user_seq, p.del_yn, p.del_dt, p.parent_seq,
    DATE_FORMAT(p.reg_dt, '%Y-%m-%d %H:%i:%s') as reg_dt,
    case
      when p.del_yn = 'Y'
      then '삭제된 댓글입니다.'
      else p.body end as body,
    count (distinct c.seq) as reply_cnt
    from comment p
    left join comment as c on p.seq=c.parent_seq
    where p.contents_seq=${contentsSeq} and p.parent_seq is NULL ${prev > -1 ? `and p.seq < ${prev}` : next > -1 ? `and p.seq > ${next}` : ``}
    group by p.seq
    order by p.seq desc
    limit ${max};
    `,
  ).then(
    (result) => {
      success = true;
      list = result;
    },
    () => {
      success = false;
    },
  );

  let count = 0;

  await select<{ count: number; first: number }>(
    `select count(*) from comment where contents_seq=${contentsSeq} and parent_seq is NULL;`,
  ).then((result) => {
    count = result[0]?.count || 0;
  });

  // 첫번째 댓글 seq
  let first = -1;

  await select<{ seq: number }>(
    `select first_value(seq) over (order by reg_dt) seq from comment where contents_seq=${contentsSeq} and parent_seq is NULL;`,
  ).then((result) => {
    first = result[0]?.seq || 0;
  });

  return Response.json({
    header: {
      status: 200,
      success,
    },
    body: {
      list,
      count,
      first,
    },
  });
}

/**
 * `POST` 컨텐츠에 `댓글`/`답글` 등록
 * - parentSeq 있으면 답글 등록
 * - Credentials
 * @param req NextRequest
 * @param param1
 * @returns Response
 */
export const POST = auth(async (req, ctx) => {
  let message = '';
  let status = 200;
  let success = false;

  const headers = getCredentialsHeaders();

  try {
    const payload: {
      body: string;
      parentSeq?: number;
    } = await req.json();

    if (!req.auth) throw new AuthError();

    const contentsSeq = ctx.params?.contentsSeq;

    await execute(
      `insert into comment(contents_seq, user_seq, reg_dt, body, parent_seq) values (${contentsSeq}, ${req.auth.user.seq}, now(6), '${payload.body ?? ''}', ${payload.parentSeq ?? null});`,
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
