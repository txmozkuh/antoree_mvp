import { z } from 'zod'

export const LoginFormSchema = z.object({
  email: z.email('Incorrect email format'),
  password: z
    .string('Cannot find your password')
    .min(6, 'Password need to have at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/,
      'Required at least 1 normal, uppercase, special character and number'
    )
})

export const RegisterFormSchema = z
  .object({
    email: z.email('Incorrect email format'),
    name: z.string('Cannot find your name ').min(2, 'Password need to have at least 2 characters'),
    fullName: z.string('Cannot find your fullname ').min(6, 'Fullname need to have at least 6 characters'),
    password: z
      .string('Cannot find your password')
      .min(6, 'Password need to have at least 6 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/,
        'Required at least 1 normal, uppercase, special character and number'
      ),
    confirm_password: z.string(),
    role: z.enum(['Teacher', 'Student'], 'Choose you role!')
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        path: ['confirm_password'],
        code: 'custom',
        message: 'Unmatch password'
      })
    }
  })

export type LoginForm = z.infer<typeof LoginFormSchema>
export type RegisterForm = z.infer<typeof RegisterFormSchema>
