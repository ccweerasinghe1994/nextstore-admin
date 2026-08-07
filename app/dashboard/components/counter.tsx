"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="mt-8 rounded-lg border border-border bg-surface p-5">
      <p>Count: {count}</p>

      <button
        type="button"
        className="mt-3 rounded bg-accent px-4 py-2 text-accent-foreground"
        onClick={() => setCount((current) => current + 1)}
      >
        Increase
      </button>
    </div>
  );
}
