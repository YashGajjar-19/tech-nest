"use client";

import { useEffect, useState } from "react";

export default function AppReady({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Prevent scroll jump natively on load without breaking Next.js metadata typings
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
    }

    const t = requestAnimationFrame(() => {
      setReady(true);
    });

    return () => cancelAnimationFrame(t);
  }, []);

  if (!ready) return null;

  return <div className="hardware-accelerated h-full">{children}</div>;
}
