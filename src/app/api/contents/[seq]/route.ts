import { auth } from '@/auth';
import { select, transaction } from '@/db/pool';
import { IContents, IContentsDetail } from '@/types';
import { catchRouteError, getCredentialsHeaders } from '@/utils';
import { QueryError } from 'mysql2';
import { AuthError } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * `GET` `게시글` 상세 조회
 * @param req NextRequest
 * @param param1 { params }
 * @returns Response
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { seq: number } },
) {
  const { seq } = params;

  let success = false;
  let status = 200;
  let message = '';
  let body: IContentsDetail | null = null;

  try {
    await select<IContentsDetail>(
      `select 
    contents.seq, contents.title, contents.user_seq, contents.category_seq,
    DATE_FORMAT(contents.reg_dt, '%Y-%m-%d %H:%i') as reg_dt,
    DATE_FORMAT(contents.mod_dt, '%Y-%m-%d %H:%i') as mod_dt,
    contents_category.main_name as main_name,
    contents_category.sub_name as sub_name,
    contents_body.body as body,
    (select count(*) from comment where comment.contents_seq = ${seq} and parent_seq is NULL) as comment_cnt
    from contents
    inner join contents_category on contents.category_seq = contents_category.seq
    inner join contents_body on contents.seq = contents_body.contents_seq
    where contents.seq=${seq} && contents.del_yn='N';
    `,
    ).then(
      (result) => {
        body = result[0] ?? null;
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
    return NextResponse.json({
      header: {
        status,
        success,
        message,
      },
      body,
    });
  }
}

export async function OPTIONS(req: Request) {
  return Response.json({});
}

/**
 * `POST` `게시글` 수정
 * - Credentials
 * @param req NextAuthRequest
 * @returns Response
 */
export const POST = auth(async (req, ctx) => {
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

    const seq = ctx.params?.seq;

    if (!req.auth) throw new AuthError();

    // 작성자와 동일인인지 확인
    const original = await select<IContents>(
      `select * from contents where seq=${seq};`,
    );

    if (original?.[0]?.userSeq !== req.auth.user.seq)
      throw new AuthError('작성한 글만 수정할 수 있습니다.');

    await transaction(
      `update contents set title='${payload.title}', category_seq=${payload.categorySeq}, mod_dt=now(6) where seq=${seq};`,
      `update contents_body set body='${payload.body}' where contents_seq=${seq};`,
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

/**
 * `DELETE` 게시글 삭제
 * - RESTful API 생성, 추후 변경될 수 있음.
 * - Credentials
 * @param req NextAuthRequest
 * @returns Response
 */
export const DELETE = auth(async (req, ctx) => {
  let message = '';
  let status = 200;
  let success = false;

  const headers = getCredentialsHeaders();

  try {
    const seq = ctx.params?.seq;

    if (!req.auth) throw new AuthError();

    // 작성자와 동일인인지 확인
    const original = await select<IContents>(
      `select * from contents where seq=${seq};`,
    );

    if (original?.[0]?.userSeq !== req.auth.user.seq)
      throw new AuthError('작성한 글만 삭제할 수 있습니다.');

    await transaction(
      `update contents set del_yn='Y', mod_dt=now(6) where seq=${seq};`,
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
