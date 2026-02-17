import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h1 className="text-2xl font-semibold">Dispatch Frontend</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Shadcn UI and Lucide are configured successfully.
        </p>
        <Button className="mt-4" onClick={() => setCount((value) => value + 1)}>
          <Plus />
          count is {count}
        </Button>
      </div>
    </main>
  );
}
