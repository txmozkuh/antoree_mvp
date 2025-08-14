import { model, Schema } from 'mongoose'

interface RefreshToken {
  userId: Schema.Types.ObjectId
  token: string
}

const refreshTokenSchema = new Schema<RefreshToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const RefreshTokenModel = model<RefreshToken>('Refresh_token', refreshTokenSchema)
