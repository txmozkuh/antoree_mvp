import z from 'zod'

export const postSchema = z.object({
  title: z.string('Tell us about your issue!').min(10, 'Describe details will be better for us!'),
  content: z.string('Provide your text so we can improve it!')
})

export type PostForm = z.infer<typeof postSchema>

export const commentSchema = z.object({
  postId: z.string(),
  userId: z.string(),
  content: z.string('Provide your text so we can improve it!')
})

export type CommentForm = z.infer<typeof commentSchema>
