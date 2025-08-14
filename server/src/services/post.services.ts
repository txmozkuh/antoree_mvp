import { Types } from 'mongoose'
import AppError from '~/libs/api-error'
import { Comment, CommentModel } from '~/models/comment.schema'
import { Post, PostModel } from '~/models/post.schema'
import { Vote, VoteModel } from '~/models/vote.schema'

class PostService {
  private postModel
  private commentModel
  private voteModel
  constructor() {
    this.postModel = PostModel
    this.commentModel = CommentModel
    this.voteModel = VoteModel
  }

  create = async (post: Post) => {
    await this.postModel.create(post)
  }

  createComment = async (comment: Comment) => {
    await this.commentModel.create(comment)
  }

  getPost = async () => {
    return await this.postModel.find()
  }

  getPostDetail = async (postId: string) => {
    const existedPost = await this.postModel.findById(postId)
    if (existedPost) return existedPost
    throw new AppError(400, "Post don't exist")
  }

  getComment = async (postId: string, userId: string) => {
    // return await this.commentModel.find({ postId })
    return CommentModel.aggregate([
      {
        $match: { postId: new Types.ObjectId(postId) }
      },
      {
        $lookup: {
          from: 'votes',
          let: { commentId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$commentId', '$$commentId'] }
              }
            },
            { $project: { type: 1, userId: 1 } }
          ],
          as: 'votes'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $addFields: {
          upvote: {
            $size: {
              $filter: {
                input: '$votes',
                as: 'vote',
                cond: { $eq: ['$$vote.type', 'like'] }
              }
            }
          },
          downvote: {
            $size: {
              $filter: {
                input: '$votes',
                as: 'vote',
                cond: { $eq: ['$$vote.type', 'dislike'] }
              }
            }
          },
          voted: {
            $let: {
              vars: {
                myVote: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$votes',
                        as: 'vote',
                        cond: {
                          $eq: ['$$vote.userId', new Types.ObjectId(userId)]
                        }
                      }
                    },
                    0
                  ]
                }
              },
              in: '$$myVote.type'
            }
          },
          author: {
            name: '$author.name',
            role: '$author.role'
          }
        }
      },
      // 4️⃣ Clean up
      {
        $project: {
          votes: 0
        }
      }
    ])
  }

  voteComment = async (commentId: string, userId: string, type: 'like' | 'dislike') => {
    const existedVote: Vote | null = await VoteModel.findOne({ commentId, userId })
    console.log(existedVote)
    if (existedVote) {
      if (existedVote.type === type) {
        await VoteModel.deleteOne({ commentId, userId })
        return `Undo ${type}`
      } else {
        await VoteModel.updateOne(
          { commentId, userId },
          {
            type
          }
        )
        return `You ${type} this comment`
      }
    } else {
      await VoteModel.create({
        commentId,
        userId,
        type
      })
      return `You ${type} this comment`
    }
  }
}

export const postService = new PostService()
