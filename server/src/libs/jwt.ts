import { TokenType } from '~/types/token'
import jwt from 'jsonwebtoken'
import { env } from './env-check'

const PRIVATE_KEY = env.JWT_SECRET_KEY

export const generateJwt = (userId: string, tokenType: TokenType, expiresIn: number) => {
  return jwt.sign(
    {
      userId,
      tokenType
    },
    PRIVATE_KEY,
    {
      algorithm: 'HS256',
      expiresIn
    }
  )
}

export const verifyJwt = (token: string) => {
  return jwt.verify(token, PRIVATE_KEY)
}
