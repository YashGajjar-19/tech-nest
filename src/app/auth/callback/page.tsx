"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const done = useRef(false);
  const [status, setStatus] = useState("Completing sign in…");

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    async function handleCallback() {
      const supabase = createClient();

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const next = url.searchParams.get("next") ?? "/";
      const error = url.searchParams.get("error");
      const errorDescription = url.searchParams.get("error_description");

      if (error) {
        console.error("[Auth Callback] OAuth error:", error, errorDescription);
        window.location.href = `/?error=${encodeURIComponent(errorDescription ?? error)}`;
        return;
      }

      if (!code) {
        window.location.href = next;
        return;
      }

      try {
        setStatus("Verifying session…");
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error("[Auth Callback] Exchange failed:", exchangeError.message);
          window.location.href = `/?error=${encodeURIComponent(exchangeError.message)}`;
          return;
        }

        if (data.session) {
          console.log("[Auth Callback] ✅ Session set for:", data.session.user.email);
          setStatus("Redirecting…");
        }

        // Use window.location.href (hard navigation) instead of router.replace
        // This forces the page to fully reload, so AuthProvider re-initialises
        // and picks up the freshly written session cookies correctly.
        window.location.href = next;
      } catch (err) {
        console.error("[Auth Callback] Unexpected error:", err);
        window.location.href = "/";
      }
    }

    handleCallback();
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/70 animate-spin" />
        <p className="text-sm text-white/50">{status}</p>
      </div>
    </div>
  );
}
