export interface AuthTokenResult {
    sub: string;
    iat: number;
    exp: number;
}

export interface UseToken {
    sub: string;
    isExpired: boolean;
}