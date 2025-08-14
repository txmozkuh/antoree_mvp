import { Router } from 'express'
import {
  createCommentController,
  createPostController,
  updateVoteCommentController,
  getPostController,
  getCommentController,
  getPostDetailController
} from '~/controllers/post.controllers'
import { accessTokenValidator, validateRequest } from '~/middlewares/validate'

const postRouter = Router()

postRouter.post('/', accessTokenValidator, validateRequest, createPostController)
postRouter.post('/comment', accessTokenValidator, validateRequest, createCommentController)
postRouter.put('/comment/:id/vote/:type', accessTokenValidator, validateRequest, updateVoteCommentController)

postRouter.get('/', accessTokenValidator, validateRequest, getPostController)
postRouter.get('/detail/:postId', accessTokenValidator, validateRequest, getPostDetailController)
postRouter.get('/:postId/comments', accessTokenValidator, validateRequest, getCommentController)

export default postRouter
