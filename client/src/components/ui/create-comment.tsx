import { Button } from './button'
import { Form, FormControl, FormField, FormItem } from './form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { commentSchema, type CommentForm } from '@/types/schemas/post.schema'
import { Textarea } from './textarea'
import { useAuthStore } from '@/store/use-auth'
import { createComment } from '@/services/post.services'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion'
import { Plus } from 'lucide-react'

interface CommentProps {
  postId: string
}

export default function CommentForm({ postId }: CommentProps) {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const createCommentMutation = useMutation({
    mutationKey: ['create', 'comment'],
    mutationFn: (data: CommentForm) => createComment(data),
    onSuccess: () => {
      toast.success('Create comment successfully')
      commentForm.unregister()
      queryClient.invalidateQueries({ queryKey: ['comment'] })
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const commentForm = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      postId,
      userId: user!._id,
      content: ''
    }
  })

  const onSubmit = (data: CommentForm) => {
    createCommentMutation.mutate(data)
  }

  return (
    <Accordion collapsible type='single' className='w-full'>
      <AccordionItem value='item-1'>
        <AccordionTrigger className='cursor-pointer hover:no-underline'>
          <div className='flex items-center justify-center gap-1 rounded-2xl border bg-white/10 px-4 py-2 hover:bg-white/20'>
            <Plus />
            Help with this issue
          </div>
        </AccordionTrigger>
        <AccordionContent className='flex flex-col gap-4 text-balance'>
          <Form {...commentForm}>
            <form onSubmit={commentForm.handleSubmit(onSubmit)} className='flex flex-col justify-end space-y-4'>
              <FormField
                control={commentForm.control}
                name='content'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormControl>
                      <Textarea placeholder='Share your knowledge' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className='ml-auto w-fit'>Comment</Button>
            </form>
          </Form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
