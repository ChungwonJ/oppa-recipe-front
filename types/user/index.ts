export interface UserInfo {
  id: number;
  name: string;
  email: string;
}

export interface CustomJwtPayload {
  sub: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}