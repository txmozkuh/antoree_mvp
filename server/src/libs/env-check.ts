import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
  CLIENT_HOST: z.string(),
  PORT: z.string(),
  REQUEST_BODY_LIMIT: z.string(),
  RATE_LIMIT_WINDOW_MIN: z.string(),
  RATE_LIMIT_MAX: z.string(),
  DB_URL: z.string().startsWith('mongodb+srv://'),
  JWT_SECRET_KEY: z.string()
})

export type envVariables = z.infer<typeof envSchema>

export const checkEnv = () => {
  try {
    const result: envVariables = envSchema.parse(process.env)
    return result
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error.issues)
    }
  }
}
export const env = checkEnv()!
