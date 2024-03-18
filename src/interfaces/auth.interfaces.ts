import { User } from 'src/users/entities/user.entity';

export interface AuthTokenResult {
  sub: string;
  iat: number;
  exp: number;
}

export interface UseToken {
  sub: string;
  isExpired: boolean;
}

export interface AuthTokenResponse {
  access_token: string;
  user: User;
}
