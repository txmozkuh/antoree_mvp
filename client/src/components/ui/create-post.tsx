import { Plus } from 'lucide-react'
import { Button } from './button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './dialog'
import { Input } from './input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { postSchema, type PostForm } from '@/types/schemas/post.schema'
import { Textarea } from './textarea'
import { useRef } from 'react'
import { useAuthStore } from '@/store/use-auth'
import { createPost } from '@/services/post.services'

export default function PostForm() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const createPostMutation = useMutation({
    mutationKey: ['create', 'post'],
    mutationFn: (data: PostForm & { authorId: string }) => createPost(data),

    onSuccess: () => {
      toast.success('Create post successfully')
      postForm.unregister()
      closeBtnRef.current?.click()
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const postForm = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: ''
    }
  })

  const submitBtnRef = useRef<HTMLButtonElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const onSubmit = (data: PostForm) => {
    toast(JSON.stringify({ ...data, authorId: user!._id }))
    console.log(user?._id)
    createPostMutation.mutate({ ...data, authorId: user!._id })
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline' ref={closeBtnRef}>
            <Plus /> Post
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px] md:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Create your post</DialogTitle>
            <DialogDescription>Post your issues! We'll help you to improve it!</DialogDescription>
          </DialogHeader>
          <Form {...postForm}>
            <form onSubmit={postForm.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={postForm.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='flex justify-between'>
                      Title <FormMessage className='text-xs' />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Describe your issue here...' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={postForm.control}
                name='content'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='flex justify-between'>
                      Content <FormMessage className='text-xs' />
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder='The paragraph here...' {...field} className='min-h-[300px]' />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className='hidden' ref={submitBtnRef}></Button>
            </form>
          </Form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button type='submit' disabled={createPostMutation.isPending} onClick={() => submitBtnRef.current?.click()}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
