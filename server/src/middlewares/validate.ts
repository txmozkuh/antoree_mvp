import { checkSchema, ValidationError, validationResult } from 'express-validator'
import { verifyJwt } from '~/libs/jwt'
import { Request, Response, NextFunction } from 'express'
import { TokenPayload, TokenType } from '~/types/token'
import AppError from '~/libs/api-error'

export const accessTokenValidator = checkSchema({
  Authorization: {
    in: ['headers'],
    exists: { errorMessage: 'Missing token' },
    custom: {
      options: async (val: string, { req }) => {
        const access_token = val.split(' ')[1]
        const decode = verifyJwt(access_token) as TokenPayload
        if (decode.tokenType !== TokenType.AccessToken) {
          throw new AppError(401, 'Token is not valid')
        }
        req.userId = decode.userId
        return true
      }
    }
  }
})

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    errors.array().map((err: ValidationError) => {
      if (err.type === 'field' && err.path === 'authorization') {
        if (err.msg === 'jwt expired') {
          res.status(401).json({
            message: 'Token expired'
          })
        }
        res.status(401).json('Authentication failed')
      }
    })
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}
