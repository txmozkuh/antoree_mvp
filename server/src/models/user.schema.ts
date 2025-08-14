import { model, Schema } from 'mongoose'

export interface User {
  fullName: string
  name: string
  email: string
  password: string
  role: 'Student' | 'Teacher'
}

const userSchema = new Schema<User>(
  {
    fullName: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Student', 'Teacher'], required: true }
  },
  { timestamps: true, versionKey: false }
)

export const UserModel = model<User>('User', userSchema)
