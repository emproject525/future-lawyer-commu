import { API_ERR_MSG_DEFAULT, API_ERR_NO_AUTH } from '@/constants';

/**
 * 권한 없음 에러
 */
class AuthError extends Error {
  constructor(message?: string) {
    super(message || API_ERR_NO_AUTH);
  }
}

/**
 * API Route 에러 캐치
 * @param e string | { status, message } | Error
 * @returns { success, status, message }
 */
export const catchRouteError = (e: unknown) => {
  let status = 500;
  let message = API_ERR_MSG_DEFAULT;

  if (e instanceof AuthError) {
    status = 400;
    message = e.message;
  } else {
    message = typeof e === 'string' ? e : API_ERR_MSG_DEFAULT;
  }

  return {
    success: false,
    status,
    message,
  };
};

/**
 * 로그인 인증 필요할 경우 헤더에 셋팅
 * @returns Credentials 처리한 헤더
 */
export const getCredentialsHeaders = () => {
  const headers = new Headers();
  headers.set(
    'Access-Control-Allow-Origin',
    process.env.NEXT_PUBLIC_SITE_DOMAIN!,
  );
  headers.set('Access-Control-Allow-Credentials', 'true');
  return headers;
};
