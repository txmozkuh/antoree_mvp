import { Loader } from 'lucide-react'

export default function Loading() {
  return (
    <div className='bg-accent/40 absolute z-1000 flex h-screen w-full items-center justify-center'>
      <div className='flex size-fit animate-pulse gap-2'>
        <Loader className='size-8 animate-spin' />
        Loading...
      </div>
    </div>
  )
}
