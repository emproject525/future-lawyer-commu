const STORAGE_KEY = 'FL';
export const ACCESS_TOKEN_KEY = 'accessToken';

/**
 * 스토리지에서 아이템 조회
 * @param name key
 * @param isSessionStorage 세션 스토리지 여부
 * @returns value (string)
 */
export const getStorageItem = (name: string, isSessionStorage?: boolean) => {
  try {
    const items: Record<string, string> = JSON.parse(
      (isSessionStorage ? sessionStorage : localStorage).getItem(STORAGE_KEY) ||
        '{}',
    );

    return items[name];
  } catch (e) {
    return '';
  }
};

/**
 * 스토리지에 아이템 저장
 * @param name key
 * @param value value
 * @param isSessionStorage 세션 스토리지 여부
 * @returns true | false
 */
export const saveStorageItem = (
  name: string,
  value: string,
  isSessionStorage?: boolean,
) => {
  try {
    const items = JSON.parse(
      (isSessionStorage ? sessionStorage : localStorage).getItem(STORAGE_KEY) ||
        '{}',
    );

    if (!items) {
      throw 'fail';
    }

    items[name] = value;

    (isSessionStorage ? sessionStorage : localStorage).setItem(
      STORAGE_KEY,
      JSON.stringify(items),
    );

    return true;
  } catch (e) {
    return false;
  }
};

/**
 * getSavedAccessToken
 * @param prefix Bearer 붙이지말지 여부
 * @returns string
 */
export const getSavedAccessToken = (prefix?: boolean) =>
  `${prefix ?? `Bearer `}${getStorageItem(ACCESS_TOKEN_KEY)}`;

/**
 * saveAccessToken
 * @param value 새 토큰
 * @returns true | false
 */
export const saveAccessToken = (value: string) =>
  saveStorageItem(ACCESS_TOKEN_KEY, value);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getStorageItem,
  saveStorageItem,
  getSavedAccessToken,
  saveAccessToken,
};
