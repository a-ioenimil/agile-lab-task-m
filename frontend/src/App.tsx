import { useState } from 'react'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Dispatch Frontend</h1>
        <p className="mt-2 text-sm text-slate-600">Tailwind CSS v4 is configured successfully.</p>
        <button
          className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          onClick={() => setCount((value) => value + 1)}
        >
          count is {count}
        </button>
      </div>
    </main>
  )
}
