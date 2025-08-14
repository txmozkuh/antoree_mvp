import Container from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterFormSchema, type RegisterForm } from '@/types/schemas/auth.schema'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { UserRole } from '@/types/User'
import { toast } from 'sonner'
import logo from '@/assets/logo_withtagline.svg'
import { PenLine } from 'lucide-react'
import { register } from '@/services/auth.services'
import { useMutation } from '@tanstack/react-query'

export default function Register() {
  const navigate = useNavigate()
  const registerMutation = useMutation({
    mutationKey: ['register'],
    mutationFn: (data: RegisterForm) => register(data),
    onSuccess: () => {
      toast.success('Register Successfully')
      setTimeout(() => navigate('/login'), 1000)
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const registerForm = useForm({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      fullName: '',
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      role: UserRole.Teacher
    }
  })

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data)
  }

  return (
    <Container className='flex-col gap-2'>
      <img src={logo} alt='logo' className='w-32' />
      <Card className='bg-card/40 w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl'>Create an account</CardTitle>
          <CardDescription>Fill your information to joining us</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={registerForm.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='flex justify-between'>
                      Your fullname <FormMessage className='text-xs' />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Your fullname here...' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='flex justify-between'>
                      Name <FormMessage className='text-xs' />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Your name here...' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='flex justify-between'>
                      Email <FormMessage className='text-xs' />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Your email here...' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='flex justify-between'>
                      Password <FormMessage className='text-xs' />
                    </FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='Your password here...' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name='confirm_password'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='flex justify-between'>
                      Confirm your password <FormMessage className='text-xs' />
                    </FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='Your password here...' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>You join as a ...</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex'>
                        <FormItem className='flex-1'>
                          <FormLabel
                            className={`${field.value === 'Teacher' ? 'bg-white/10 ring' : ''} border-border flex items-start gap-3 rounded-2xl border p-4 transition-all duration-200`}
                          >
                            <FormControl>
                              <RadioGroupItem value='Teacher' />
                            </FormControl>
                            <FormDescription className='space-y-1'>
                              <h1 className='text-foreground'>Teacher</h1>
                              <p className='text-muted-foreground text-xs'>Contribute lession and knowledge</p>
                            </FormDescription>
                          </FormLabel>
                        </FormItem>
                        <FormItem className='flex-1'>
                          <FormLabel
                            className={`${field.value === 'Student' ? 'bg-white/10 ring' : ''} border-border flex items-start gap-3 rounded-2xl border p-4 transition-all duration-200`}
                          >
                            <FormControl>
                              <RadioGroupItem value='Student' />
                            </FormControl>
                            <FormDescription className='space-y-1'>
                              <h1 className='text-foreground'>Student</h1>
                              <p className='text-muted-foreground text-xs'>Acknowledge new lession</p>
                            </FormDescription>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className='justify-self-center' />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='text-md mt-4 w-full cursor-pointer gap-1 font-semibold'
                size={'lg'}
                disabled={registerMutation.isPending}
              >
                Register <PenLine className='size-4' />
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className='flex-col gap-6'>
          <div className='flex w-full items-center gap-2'>
            <Separator className='flex-1' />
            <p className='text-muted-foreground text-xs uppercase'>Already have an account?</p>
            <Separator className='flex-1' />
          </div>
          <Link to='/login' className='w-full'>
            <Button variant='outline' className='w-full cursor-pointer' size={'lg'}>
              Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </Container>
  )
}
