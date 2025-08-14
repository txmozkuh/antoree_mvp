import { Router } from 'express'
import postRouter from './post.routes'
import authRouter from './auth.routes'

const router = Router()
router.use('/auth', authRouter)
router.use('/post', postRouter)

export const apiRouter = router
