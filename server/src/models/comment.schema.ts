import { model, Schema } from 'mongoose'

export interface Comment {
  userId: Schema.Types.ObjectId
  postId: Schema.Types.ObjectId
  content: string
  upVote?: number
  downVote?: number
}

const commentSchema = new Schema<Comment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true },
    upVote: {
      type: Number,
      required: true,
      default: 0
    },
    downVote: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const CommentModel = model<Comment>('Comment', commentSchema)
