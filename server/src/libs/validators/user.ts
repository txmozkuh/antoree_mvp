import { z } from 'zod'

export const createUserSchema = z.object({
  body: z.object({
    fullname: z.string().min(1, 'Fullname is required'),
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email'),
    role: z.enum(['Teacher', 'Student']).optional()
  })
})

export type CreateUserInput = z.infer<typeof createUserSchema>['body']
