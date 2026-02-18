import { Activity, Loader2, Plus, ShieldCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useHealthCheck } from '@/hooks/use-health-check'

export function App() {
  const [count, setCount] = useState(0)
  const { data, isLoading, isError } = useHealthCheck()

  const statusLabel = isLoading
    ? 'Checking backend status...'
    : isError
      ? 'Backend unavailable'
      : data?.status === 'ok'
        ? 'Backend healthy'
        : 'Unexpected backend response'

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0b0b0d] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(252,211,77,0.18),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(245,158,11,0.2),transparent_50%)]" />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-[#111114]/80 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
        <div className="grid gap-8 p-8 sm:p-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-amber-200/80">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
              Dispatch Walking Skeleton
            </div>

            <h1 className="text-3xl font-semibold leading-tight text-amber-50 sm:text-4xl">
              Frontend ↔ Backend Health Check
            </h1>

            <p className="max-w-xl text-sm text-slate-200/70">
              This page pings the FastAPI health endpoint through the shared Axios client and React Query.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/35 p-5">
            <div className="flex items-center gap-3 text-sm text-slate-200/80">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-amber-200" />
              ) : (
                <Activity className="h-4 w-4 text-amber-200" />
              )}
              <span>{statusLabel}</span>
            </div>

            {!isError && data ? (
              <p className="mt-2 text-xs text-amber-100/70">Response payload: status = {data.status}</p>
            ) : null}
          </div>

          <div className="space-y-3 text-sm text-slate-200/75">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-amber-200" />
              API calls go through `src/lib/api.ts` interceptors.
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-amber-200" />
              Data fetching lives in `src/hooks` with TanStack Query.
            </div>
          </div>

          <Button
            className="h-11 w-fit bg-amber-200 text-black shadow-[0_12px_40px_rgba(252,211,77,0.35)] hover:bg-amber-200"
            onClick={() => setCount((value) => value + 1)}
          >
          <Plus />
          count is {count}
        </Button>
        </div>
      </div>
    </main>
  )
}
