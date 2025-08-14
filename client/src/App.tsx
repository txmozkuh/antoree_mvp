import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from './hooks/use-route'

export default function App() {
  const routes = useRouter()
  const queryClient = new QueryClient()
  return (
    <div className=''>
      <QueryClientProvider client={queryClient}>{routes}</QueryClientProvider>
    </div>
  )
}
