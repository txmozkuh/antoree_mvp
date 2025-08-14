import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { checkGrammar } from '~/libs/utils/check-grammar'
import { Comment } from '~/models/comment.schema'
import { Post } from '~/models/post.schema'
import { postService } from '~/services/post.services'

export const createPostController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post: Post = req.body
    const issues = await checkGrammar(post.content)
    await postService.create({ ...post, issues, authorId: new mongoose.Types.ObjectId(post.authorId) })
    res.json({
      message: 'Create post successfully',
      data: {
        ...post,
        issues
      }
    })
  } catch (error) {
    next(error)
  }
}

export const createCommentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comment: Comment = req.body
    const data = await postService.createComment(comment)
    res.json({
      message: 'Create comment successfully',
      data
    })
  } catch (error) {
    next(error)
  }
}

export const updateVoteCommentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: commentId, type } = req.params
    const message = await postService.voteComment(commentId, '689b838706d186a058534b4d', type as 'like' | 'dislike')
    res.status(200).json({
      message: message
    })
  } catch (error) {
    next(error)
  }
}

export const getPostController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await postService.getPost()
    res.status(200).json({
      message: 'Success',
      data: posts
    })
  } catch (error) {
    next(error)
  }
}

export const getPostDetailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params
    const post = await postService.getPostDetail(postId)
    res.status(200).json({
      message: 'Get post successfully',
      data: post
    })
  } catch (error) {
    next(error)
  }
}

export const getCommentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params
    const comments = await postService.getComment(postId, '689b838706d186a058534b4d') //id checking if user is voted or not
    res.status(200).json({
      message: 'Success',
      data: comments
    })
  } catch (error) {
    next(error)
  }
}
