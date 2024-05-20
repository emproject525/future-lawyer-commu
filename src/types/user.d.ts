/**
 * ------------------------------------
 * 회원
 * `user`
 * ------------------------------------
 */

/**
 * `user`
 */
export interface IUser {
  seq: number;
  email: string;
  password?: string;
  joinDt: string;
  joinType: 1 | 2 | 3;
  joinKey?: string;
  level: number;
  accessToken?: string;
  refreshToken?: string;
}
