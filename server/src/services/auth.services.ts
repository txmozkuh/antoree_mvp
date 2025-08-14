import { generateJwt, verifyJwt } from '~/libs/jwt'
import { RefreshTokenModel } from '~/models/refresh_token.schema'
import { User, UserModel } from '~/models/user.schema'
import { TokenType } from '~/types/token'
import bcrypt from 'bcrypt'
import AppError from '~/libs/api-error'
import { Types } from 'mongoose'

class AuthService {
  private UserModel
  private RefreshTokenModel
  constructor() {
    this.UserModel = UserModel
    this.RefreshTokenModel = RefreshTokenModel
  }

  storeRefreshToken = async (userId: string, token: string) => {
    await RefreshTokenModel.create({ userId, token })
  }

  deleteRefreshToken = async (userId: string, token: string) => {
    await RefreshTokenModel.deleteOne({ userId, token })
  }

  generateToken = async (userId: string) => {
    const accessToken = generateJwt(userId, TokenType.AccessToken, 900)
    const refreshToken = generateJwt(userId, TokenType.AccessToken, 604800)
    return { accessToken, refreshToken }
  }

  register = async (user: User) => {
    const existedData = await UserModel.findOne({ email: user.email })
    if (!existedData) {
      const hashedPassword = await bcrypt.hash(user.password, 10)
      const newUser = await UserModel.create({ ...user, password: hashedPassword })
      return newUser.toJSON()
    } else {
      throw new AppError(409, 'Email already in use')
    }
  }

  login = async (email: string, password: string) => {
    const existedData = (
      await UserModel.findOne({
        email
      })
    )?.toJSON()
    if (existedData) {
      const isPassword = await bcrypt.compare(password, existedData.password)
      if (isPassword) {
        const { accessToken, refreshToken } = await this.generateToken(existedData._id.toString())
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userData } = existedData
        return { userData, accessToken, refreshToken }
      } else {
        throw new AppError(401, 'Incorrect password')
      }
    } else {
      throw new AppError(401, 'Incorrect email')
    }
  }

  refreshToken = async (userId: string) => {
    const existedRefreshToken = await RefreshTokenModel.findOne({ userId: new Types.ObjectId(userId) })
    if (!existedRefreshToken) {
      throw new AppError(401, 'Refresh token not found')
    }
    try {
      verifyJwt(existedRefreshToken.token)
      const newAccessToken = generateJwt(existedRefreshToken.userId.toString(), TokenType.AccessToken, 900)
      return newAccessToken
    } catch (error) {
      await RefreshTokenModel.deleteOne({ token: existedRefreshToken.token })
      console.error(error)
      throw new AppError(401, 'Invalid or expired refresh token')
    }
  }

  logOut = async (refresh_token: string, userId: string) => {
    await RefreshTokenModel.deleteOne({ userId, token: refresh_token })
  }
}

export const authServer = new AuthService()
