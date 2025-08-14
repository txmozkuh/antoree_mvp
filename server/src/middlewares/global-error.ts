import express, { Request, Response, NextFunction } from 'express'
import AppError from '~/libs/api-error'

const app = express()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    })
  }
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  })
})
