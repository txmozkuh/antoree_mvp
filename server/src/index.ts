import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { checkEnv, env } from './libs/env-check'
import { apiRouter } from './routes'
import connectDB from './libs/db'
import AppError from './libs/api-error'

checkEnv()

const app = express()
const PORT = Number(env.PORT) || 4000

app.use(helmet())
app.use(
  cors({
    origin: env.CLIENT_HOST || 'http://localhost:3000',
    credentials: true
  })
)

app.use(morgan('dev'))
app.use(express.json({ limit: env.REQUEST_BODY_LIMIT || '10kb' }))
app.use(
  rateLimit({
    windowMs: Number(env.RATE_LIMIT_WINDOW_MIN || 15) * 60 * 1000,
    max: Number(env.RATE_LIMIT_MAX) || 100
  })
)

app.use('/api', apiRouter)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  })
})

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Running on port: ${PORT}`)
  })
})

export default app
