import { Card } from '@/components/ui/card'
import PostForm from '@/components/ui/create-post'
import { Skeleton } from '@/components/ui/skeleton'
import { getPost } from '@/services/post.services'
import { useAuthStore } from '@/store/use-auth'
import type { PostForm as PostFormType } from '@/types/schemas/post.schema'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'

export default function Home() {
  const { user } = useAuthStore()
  const { data: postData, isPending } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPost()
  })
  const posts = postData?.data as (PostFormType & { _id: string; authorId: string })[]
  return (
    <div>
      <div className='flex justify-between border-b pb-5'>
        <h1 className='text-lg md:text-xl lg:text-2xl'>Newest Questions</h1>
        <PostForm />
      </div>
      <div className='flex flex-col gap-4 py-5'>
        {isPending ? (
          <div className='space-y-4'>
            <Skeleton className='bg-muted/50 h-26 w-full' />
            <Skeleton className='bg-muted/50 h-26 w-full' />
            <Skeleton className='bg-muted/50 h-26 w-full' />
            <Skeleton className='bg-muted/50 h-26 w-full' />
            <Skeleton className='bg-muted/50 h-26 w-full' />
            <Skeleton className='bg-muted/50 h-26 w-full' />
          </div>
        ) : (
          posts?.map((post) => {
            return (
              <Link to={`/detail/${post._id}`}>
                <Card className='bg-muted/50 hover:bg-muted/20 cursor-pointer px-12'>
                  <div className=''>
                    <h2 className='text-lg font-semibold text-green-300'>{post.title}</h2>
                    <p className='text-muted-foreground text-sm'>{post.content}</p>
                  </div>
                  <div className='flex justify-end gap-4 text-sm text-white/80'>
                    <span> 0 votes</span>
                    <span> 0 comments</span>
                    <span className='underline'>Asked by {post.authorId == user?._id ? 'me' : 'Not me'}</span>
                  </div>
                </Card>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
