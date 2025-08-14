import { Router } from 'express'
import {
  registerController,
  loginController,
  refreshTokenController,
  logOutController
} from '~/controllers/auth.controllers'
import { validateRequest } from '~/middlewares/validate'

const authRouter = Router()

authRouter.post('/register', registerController)
authRouter.post('/login', loginController)
authRouter.post('/refresh', validateRequest, refreshTokenController)
authRouter.post('/logout', validateRequest, logOutController)

export default authRouter
