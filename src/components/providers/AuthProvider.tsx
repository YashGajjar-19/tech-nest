"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { AppRole } from "@/lib/auth/types";

interface AuthContextType {
  user: User | null;
  role: AppRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  openAuthModal: (mode?: "login" | "signup") => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
  openAuthModal: () => {},
});

const AUTH_MODAL_EVENT = "open-auth-modal";

export function openAuthModal(mode: "login" | "signup" = "login") {
  window.dispatchEvent(new CustomEvent(AUTH_MODAL_EVENT, { detail: { mode } }));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  // Start as TRUE — stays true until BOTH the session check AND role fetch complete
  const [loading, setLoading] = useState(true);

  const [supabase] = useState(() => createClient());

  const fetchRole = useCallback(
    async (userId: string): Promise<AppRole> => {
      try {
        // Race the DB call against a 4s timeout — prevents infinite loading
        const result = await Promise.race([
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", userId)
            .maybeSingle(),
          new Promise<{ data: null; error: Error }>((resolve) =>
            setTimeout(() => resolve({ data: null, error: new Error("timeout") }), 4000)
          ),
        ]);
        return ((result.data as { role?: string } | null)?.role as AppRole) ?? "user";
      } catch {
        return "user";
      }
    },
    [supabase]
  );

  useEffect(() => {
    let mounted = true;

    // ── Step 1: Get the current session synchronously on mount ─────────────────
    // This covers Google OAuth users who just came back from a redirect.
    // We wait for BOTH the session AND the role before setting loading=false,
    // preventing the profile page from redirecting prematurely.
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        const fetchedRole = await fetchRole(session.user.id);
        if (!mounted) return;
        setUser(session.user);
        setRole(fetchedRole);
      }

      // Only NOW is it safe to set loading=false — user + role are both resolved
      setLoading(false);
    };

    initSession();

    // ── Step 2: Subscribe to future auth state changes ────────────────────────
    // Handles: email login, logout, token refresh, sign up confirmations
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      // Ignore INITIAL_SESSION — already handled by initSession() above.
      // This prevents a double-fetch race condition for Google OAuth users.
      if (event === "INITIAL_SESSION") return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const fetchedRole = await fetchRole(currentUser.id);
        if (!mounted) return;
        setRole(fetchedRole);
      } else {
        setRole(null);
      }

      // If somehow loading is still true at this point, unblock it
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchRole, supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  const triggerAuthModal = useCallback((mode: "login" | "signup" = "login") => {
    openAuthModal(mode);
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut, openAuthModal: triggerAuthModal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
