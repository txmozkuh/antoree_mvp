import { NextFunction, Request, Response } from 'express'
import { User } from '~/models/user.schema'
import { authServer } from '~/services/auth.services'
import { LoginRequest, RefreshTokenRequest } from '~/types/request'

export const registerController = async (req: Request<unknown, unknown, User>, res: Response, next: NextFunction) => {
  try {
    const user: User = req.body
    const result = await authServer.register(user)
    res.json({
      message: 'Register successfully',
      data: {
        result
      }
    })
  } catch (error) {
    next(error)
  }
}
export const loginController = async (
  req: Request<unknown, unknown, LoginRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body
    const { userData, accessToken, refreshToken } = await authServer.login(email, password)
    await authServer.storeRefreshToken(userData._id.toString(), refreshToken)
    res.json({
      message: 'Login successfully',
      data: {
        ...userData,
        accessToken
      }
    })
  } catch (error) {
    next(error)
  }
}

export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body
    const access_token = await authServer.refreshToken(userId)
    res.json({
      message: 'Token refreshed',
      data: {
        access_token
      }
    })
  } catch (error) {
    next(error)
  }
}

export const logOutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, refresh_token } = req.body
    await authServer.logOut(refresh_token, userId)
    res.json({
      message: 'Log out successfully'
    })
  } catch (error) {
    next(error)
  }
}
