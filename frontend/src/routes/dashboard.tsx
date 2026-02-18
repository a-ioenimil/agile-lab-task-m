import { createRoute, redirect, useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { getAccessToken } from '@/lib/auth-session'
import { rootRoute } from '@/routes/__root'

function DashboardPage() {
  const navigate = useNavigate()
  const { signOut, user } = useAuth()

  function handleSignOut(): void {
    signOut()
    navigate({ to: '/login' })
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0b0d] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(252,211,77,0.2),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(245,158,11,0.2),transparent_45%)]" />
      <div className="relative z-10 w-full max-w-xl rounded-[24px] border border-white/10 bg-[#111114]/85 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        <h1 className="text-3xl font-semibold text-amber-50">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-200/70">Authenticated session is active.</p>
        <p className="mt-4 text-sm text-amber-100/80">Welcome, {user?.full_name ?? 'User'}.</p>
        <Button
          className="mt-6 h-11 bg-amber-200 text-black hover:bg-amber-200"
          onClick={handleSignOut}
        >
          Sign out
        </Button>
      </div>
    </main>
  )
}

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: () => {
    if (getAccessToken() === null) {
      throw redirect({ to: '/login' })
    }
  },
  component: DashboardPage,
})
