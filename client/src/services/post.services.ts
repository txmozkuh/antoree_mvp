import { httpService } from '@/lib/http'
import type { CommentForm, PostForm } from '@/types/schemas/post.schema'

const POST_URL = import.meta.env.VITE_API_URL + '/post'

export const createPost = async (postForm: PostForm & { authorId: string }) => {
  return await httpService.post(POST_URL, postForm)
}

export const createComment = async (commentForm: CommentForm) => {
  return await httpService.post(`${POST_URL}/comment`, commentForm)
}

export const getPostComments = async (postId: string) => {
  return await httpService.get(`${POST_URL}/${postId}/comments`)
}

export const getPost = async () => {
  return await httpService.get(POST_URL)
}

export const getPostDetail = async (postId: string) => {
  return await httpService.get(`${POST_URL}/detail/${postId}`)
}

export const voteComment = async ({ commentId, type }: { commentId: string; type: 'like' | 'dislike' }) => {
  return await httpService.put(`${POST_URL}/comment/${commentId}/vote/${type}`)
}
