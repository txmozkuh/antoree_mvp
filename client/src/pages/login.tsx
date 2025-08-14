import Container from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginFormSchema, type LoginForm } from '@/types/schemas/auth.schema'
import { toast } from 'sonner'
import logo from '@/assets/logo_withtagline.svg'
import { Key, LogIn, Mail } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/services/auth.services'
import { useAuthStore, type User } from '@/store/use-auth'

export default function Login() {
  const loginStore = useAuthStore((state) => state.login)
  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: (data: LoginForm) => login(data),
    onSuccess: (res) => {
      const userData = res.data as User
      loginStore(userData, userData.accessToken)
      toast.success('Login Successfully')
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const loginForm = useForm({
    resolver: zodResolver(LoginFormSchema)
  })

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data)
  }

  return (
    <Container className='flex flex-col gap-2'>
      <img src={logo} alt='logo' className='w-32' />
      <Card className='bg-card/40 w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={loginForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex justify-between'>
                      <p className='flex items-center gap-1'>
                        <Mail className='size-4' />
                        Email
                      </p>
                      <FormMessage className='text-xs' />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Your email here...' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex justify-between'>
                      <p className='flex items-center gap-1'>
                        <Key className='size-4' />
                        Password
                      </p>
                      <FormMessage className='text-xs' />
                    </FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='Your password here...' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='text-md mt-2 w-full cursor-pointer gap-1 font-semibold'
                disabled={loginMutation.isPending}
                size='lg'
              >
                Login <LogIn />
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className='flex-col gap-6'>
          <div className='flex w-full items-center gap-2'>
            <Separator className='flex-1' />
            <p className='text-muted-foreground text-xs uppercase'>Don't have account?</p>
            <Separator className='flex-1' />
          </div>
          <Link to='/register' className='w-full'>
            <Button variant='outline' className='w-full cursor-pointer' size='lg'>
              Register
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </Container>
  )
}
