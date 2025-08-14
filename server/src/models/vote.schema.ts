import { model, Schema } from 'mongoose'

export interface Vote {
  commentId: Schema.Types.ObjectId
  userId: Schema.Types.ObjectId
  type: 'like' | 'dislike'
  createdAt: Date
  updatedAt: Date
}

const likeSchema = new Schema<Vote>(
  {
    commentId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['like', 'dislike'],
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const VoteModel = model<Vote>('Vote', likeSchema)
