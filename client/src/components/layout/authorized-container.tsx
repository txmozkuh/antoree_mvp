import type { ReactNode } from 'react'
import Background from '../ui/background'
import { SidebarProvider } from '../ui/sidebar'
import { AppSidebar } from './app-sidebar'

interface Props {
  children: ReactNode
}

export default function AuthorizedContainer({ children }: Props) {
  return (
    <div className={`bg-accent/50 relative flex min-h-screen w-full items-center justify-center`}>
      <div className='min-h-screen max-w-[1400px] flex-1'>
        <SidebarProvider>
          <AppSidebar />
          <div className='w-full border-r'>
            <div className='border-b p-5'>Dialog here</div>
            <div className='p-5'>{children}</div>
          </div>
        </SidebarProvider>
      </div>
      <Background />
    </div>
  )
}
