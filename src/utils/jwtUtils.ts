import jwt, { VerifyErrors } from 'jsonwebtoken';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || '';
const ALGORITHM = 'HS256';

/**
 * accessToken 생성 (1시간)
 * @param seq 유저 번호
 * @returns token
 */
export const getAccessToken = (seq: number) =>
  jwt.sign({ seq }, NEXTAUTH_SECRET, {
    algorithm: ALGORITHM,
    expiresIn: '1h',
  });

/**
 * refreshToken 생성 (2주)
 * @param seq 유저 번호
 * @returns token
 */
export const getRefreshToken = (seq: number) =>
  jwt.sign({ seq }, NEXTAUTH_SECRET, {
    algorithm: ALGORITHM,
    expiresIn: '14d',
  });

/**
 * 토큰에서 회원 번호 디코드
 * @param token 토큰
 * @returns Promise<{ decoded, error }>
 * - decoded: 회원번호(에러 시 -1)
 * - error: VerifyErrors
 */
export const decodeToken = (
  token: string,
): Promise<{
  decoded: number;
  error: VerifyErrors | null;
}> =>
  new Promise((resolve) =>
    jwt.verify(
      token,
      NEXTAUTH_SECRET,
      {
        algorithms: [ALGORITHM],
      },
      (error, decoded) =>
        resolve({
          decoded: typeof decoded === 'string' ? Number(decoded) : -1,
          error,
        }),
    ),
  );
