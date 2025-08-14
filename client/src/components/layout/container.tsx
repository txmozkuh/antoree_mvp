import type { ReactNode } from 'react'
import Background from '../ui/background'

interface ContainerProps {
  children: ReactNode
  className?: string
}
export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={`relative flex min-h-screen w-full items-center justify-center ${className}`}>
      {children}
      <Background />
    </div>
  )
}
