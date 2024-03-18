import { AuthTokenResult, UseToken } from '../interfaces/auth.interfaces';
import * as jwt from 'jsonwebtoken';

export const useToken = (token: string): UseToken | string => {
  try {
    const decodedToken = jwt.decode(token) as AuthTokenResult;

    if (!token) {
      return null;
    }

    const currentDate = new Date();
    const tokenDate = new Date(decodedToken.exp);

    return {
      sub: decodedToken.sub,
      isExpired: +tokenDate <= +currentDate / 1000,
    };
  } catch (error) {
    return 'Invalid token';
  }
};
