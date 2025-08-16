import AuthorizedContainer from '@/components/layout/authorized-container'
import Loading from '@/components/layout/loading'
import { useAuthStore } from '@/store/use-auth'
import { lazy, Suspense } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router'

const Home = lazy(() => import('@/pages/home'))
const Login = lazy(() => import('@/pages/login'))
const Register = lazy(() => import('@/pages/register'))
const PostDetail = lazy(() => import('@/pages/post-detail'))

// eslint-disable-next-line react-refresh/only-export-components
const AuthorizedRoute = () => {
  const { isAuthorized, user } = useAuthStore()
  return isAuthorized && user ? (
    <Suspense fallback={<Loading />}>
      <AuthorizedContainer>
        <Outlet />
      </AuthorizedContainer>
    </Suspense>
  ) : (
    <Navigate to='/login' replace />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
const UnAuthorizedRoute = () => {
  const { isAuthorized, user } = useAuthStore()
  return !isAuthorized || !user ? (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  ) : (
    <Navigate to='/' replace />
  )
}

export const useRouter = () => {
  const routes = useRoutes([
    {
      element: <UnAuthorizedRoute />,
      children: [
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/register',
          element: <Register />
        }
      ]
    },
    {
      element: <AuthorizedRoute />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/detail/:id',
          element: <PostDetail />
        }
      ]
    },
    {
      path: '*',
      element: <Navigate to='/' replace />
    }
  ])
  return routes
}
