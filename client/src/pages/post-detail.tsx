import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CommentForm from '@/components/ui/create-comment'
import { Separator } from '@/components/ui/separator'
import { getPostComments, getPostDetail, voteComment } from '@/services/post.services'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import { type CommentForm as CommentType } from '@/types/schemas/post.schema'
import { GrammarHighlighter, type GrammarIssue } from '@/components/ui/grammar-highlighter'

export default function PostDetail() {
  const queryClient = useQueryClient()
  const pathname = useParams()
  const postId = pathname.id!
  const voteMutation = useMutation({
    mutationKey: ['comment', 'vote'],
    mutationFn: ({ commentId, type }: { commentId: string; type: 'like' | 'dislike' }) =>
      voteComment({ commentId, type })
  })

  const handleVote = (commentId: string, type: 'like' | 'dislike') => {
    voteMutation.mutate(
      { commentId, type },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ['comment']
          })
          toast.success(data.message)
        }
      }
    )
  }

  const { data: commentData } = useQuery({
    queryKey: ['comment'],
    queryFn: () => getPostComments(postId)
  })
  const { data: postDetailData } = useQuery({
    queryKey: ['post', 'detail'],
    queryFn: () => getPostDetail(postId)
  })
  const post = postDetailData?.data as {
    title: string
    content: string
    authorId: string
    issues: GrammarIssue[]
  }

  const comments = commentData?.data as (CommentType & {
    _id: string
    upvote: number
    downvote: number
    voted: 'like' | 'dislike' | null
    author: {
      name: string
      role: 'Student' | 'Teacher'
    }
  })[]

  return (
    <div className=''>
      <Card className='bg-muted/20 shadow-2xl drop-shadow-2xl'>
        <CardHeader>
          <CardTitle className='px-6 text-xl text-green-300'>{post?.title}</CardTitle>
          <CardContent className='bg-muted/70 rounded-xl py-4 shadow-2xl'>
            <GrammarHighlighter paragraph={post?.content} issues={post?.issues} />
          </CardContent>
        </CardHeader>
      </Card>
      <div className='my-4 text-xl'>
        <span>{comments?.length || 0} Comments</span>
        <CommentForm postId={postId} />
      </div>
      <Separator />
      <div className='space-y-8 p-8'>
        {comments?.map((comment) => {
          return (
            <div className='flex gap-2'>
              <div className='flex flex-col gap-2'>
                <Button
                  variant={comment.voted === 'like' ? 'default' : 'outline'}
                  className='aspect-square rounded-full'
                  onClick={() => handleVote(comment._id, 'like')}
                >
                  <ThumbsUp />
                  {comment.upvote}
                </Button>
                <Button
                  variant={comment.voted === 'dislike' ? 'default' : 'outline'}
                  className='aspect-square rounded-full'
                  onClick={() => handleVote(comment._id, 'dislike')}
                >
                  <ThumbsDown />
                  {comment.downvote}
                </Button>
              </div>

              <Card className='bg-muted/20 flex-1 gap-0 shadow-2xl drop-shadow-2xl transition-all duration-200 hover:bg-white/5'>
                <CardHeader className=''>
                  <h2 className='text-lg font-semibold text-green-300'>{comment.author.name}</h2>
                </CardHeader>
                <CardContent className='rounded-xl'>
                  <div>{comment.content}</div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
