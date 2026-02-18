import { createRoute, Link, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { persistAuthSession, register } from '@/lib/auth'
import { rootRoute } from '@/routes/__root'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type RegisterValues = z.infer<typeof registerSchema>

function RegisterPage() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: RegisterValues): Promise<void> {
    setErrorMessage(null)
    try {
      const response = await register({
        email: values.email,
        password: values.password,
        full_name: values.fullName,
      })
      persistAuthSession(response)
      navigate({ to: '/' })
    } catch {
      setErrorMessage('Unable to create account. Please try another email.')
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0b0d] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(252,211,77,0.2),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(245,158,11,0.2),transparent_45%)]" />
      <div className="relative z-10 w-full max-w-md rounded-[24px] border border-white/10 bg-[#111114]/85 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        <div className="mb-6 space-y-2">
          <h1 className="text-3xl font-semibold text-amber-50">Create account</h1>
          <p className="text-sm text-slate-200/70">Join Dispatch and start managing tasks.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-100/80">Full name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jane Doe"
                      className="h-11 border-white/10 bg-black/40 text-amber-50 placeholder:text-amber-100/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-100/80">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@company.com"
                      className="h-11 border-white/10 bg-black/40 text-amber-50 placeholder:text-amber-100/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-100/80">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Create a secure password"
                      className="h-11 border-white/10 bg-black/40 text-amber-50 placeholder:text-amber-100/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorMessage ? <p className="text-sm text-red-300">{errorMessage}</p> : null}

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="h-11 w-full bg-amber-200 text-black hover:bg-amber-200"
            >
              {form.formState.isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-amber-100/70">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-200 hover:text-amber-100">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})
