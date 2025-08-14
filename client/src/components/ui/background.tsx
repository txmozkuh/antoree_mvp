import background from '@/assets/background.jpg'
export default function Background() {
  return (
    <picture className='fixed inset-0 top-0 left-0 -z-100 size-full overflow-hidden'>
      <img
        // src='https://persistent.oaistatic.com/burrito-nux/640.webp'
        src={background}
        className='absolute inset-0 size-full scale-[1.02] object-cover opacity-50 blur-2xl dark:opacity-30'
      />
      <div className='absolute inset-0 w-full bg-gradient-to-b from-transparent to-white dark:to-black/40'></div>
    </picture>
  )
}
