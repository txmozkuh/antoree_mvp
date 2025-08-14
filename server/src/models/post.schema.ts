import { Schema, model, Types } from 'mongoose'

interface GrammarIssue {
  message: string
  offset: number
  length: number
  replacements: {
    value: string
  }[]
}

export interface Post {
  title: string
  content: string
  authorId: Types.ObjectId
  issues?: GrammarIssue[]
}

const grammarIssueSchema = new Schema<GrammarIssue>(
  {
    message: { type: String, required: true },
    offset: { type: Number, required: true },
    length: { type: Number, required: true },
    replacements: [{ value: { type: String, required: true } }]
  },
  {
    _id: false
  }
)

const postSchema = new Schema<Post>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    issues: [grammarIssueSchema]
  },
  { timestamps: true, versionKey: false }
)

export const PostModel = model<Post>('Post', postSchema)
