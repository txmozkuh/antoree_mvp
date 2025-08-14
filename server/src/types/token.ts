export enum TokenType {
  RefreshToken,
  AccessToken
}

export interface TokenPayload {
  userId: string
  tokenType: 1
  iat: number
  exp: number
}
