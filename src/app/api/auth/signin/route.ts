import { NextRequest, NextResponse } from 'next/server';
import { IUser } from '@/types';
import crypto from 'crypto';
import { select, execute } from '@/db/pool';
import { getAccessToken, getRefreshToken } from '@/utils/jwtUtils';

export async function POST(req: NextRequest) {
  let success = false;
  let message = '계정을 확인해주세요.';

  try {
    const { email, password }: { email: string; password: string } =
      await req.json();
    let user: IUser | null = null;

    if (email && password) {
      const encryption = crypto
        .createHash(process.env.NEXT_PUBLIC_CRYPTO_HASH!)
        .update(password)
        .digest('base64');

      await select<IUser>(
        `select * from user where email='${email}' && password='${encryption}';`,
      ).then((res) => {
        if (res.length > 0) {
          success = true;
          user = res[0];
        } else {
          message = '등록된 회원정보가 없습니다.';
        }
      });

      if (!success || !user) {
        throw message;
      }

      const seq: number = (user as IUser).seq;
      const accessToken = getAccessToken(seq);
      const refreshToken = getRefreshToken(seq);

      await execute(`
        update user
          set access_token='${accessToken}', refresh_token='${refreshToken}'
          where seq=${seq};
      `).then(
        () => {
          success = true;
        },
        () => {
          success = false;
          message = '토큰 발행 실패';
        },
      );

      if (!success) {
        throw message;
      }

      const headers = new Headers();
      headers.set(
        'Set-Cookie',
        `refreshToken=${refreshToken}; Path=/; Max-Age=${60 * 60 * 24 * 14}; HttpOnly;`,
      );
      // headers.set('Access-Control-Expose-Headers', 'Set-Cookie');
      // headers.append(
      //   'Set-Cookie',
      //   `accessToken=${accessToken}; Path=/; Max-Age=${60 * 60}; HttpOnly;`,
      // );

      return NextResponse.json(
        {
          header: {
            status: 200,
            success,
          },
          body: accessToken,
        },
        { headers },
      );
    }

    throw message;
  } catch (e) {
    return Response.json({
      header: {
        status: 400,
        success: false,
      },
      body: String(e),
    });
  }
}
