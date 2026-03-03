"use client";

import { useEffect, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

const MODAL_EVENT = "open-auth-modal";

// ─── Google Logo SVG ──────────────────────────────────────────────────────────
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function AuthInput({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  suffix,
  autoComplete,
  disabled,
}: {
  icon: React.ElementType;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: React.ReactNode;
  autoComplete?: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <Icon className="h-4 w-4 text-text-secondary group-focus-within:text-text-primary transition-colors duration-200" />
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className={cn(
          "w-full h-11 pl-10 pr-10 rounded-xl text-sm text-text-primary placeholder:text-text-secondary/60",
          "bg-bg-secondary border border-border-subtle",
          "focus:outline-none focus:ring-2 focus:ring-text-primary/20 focus:border-text-primary/30",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      />
      {suffix && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{suffix}</div>
      )}
    </div>
  );
}

// ─── Main Auth Modal ──────────────────────────────────────────────────────────
export function AuthModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const supabase = createClient();

  // Listen for global open event from Navbar / any component
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setMode(detail?.mode ?? "login");
      setError(null);
      setSuccessMsg(null);
      setEmail("");
      setPassword("");
      setFullName("");
      setOpen(true);
    };
    window.addEventListener(MODAL_EVENT, handler);
    return () => window.removeEventListener(MODAL_EVENT, handler);
  }, []);

  function switchMode(m: AuthMode) {
    setMode(m);
    setError(null);
    setSuccessMsg(null);
  }

  function handleClose(v: boolean) {
    if (!v) {
      setOpen(false);
      setError(null);
      setSuccessMsg(null);
    }
  }

  // ── Email/Password Auth ────────────────────────────────────────────────────
  async function handleEmailAuth() {
    setError(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (mode === "signup" && !fullName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    startTransition(async () => {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setError(
            error.message === "Invalid login credentials"
              ? "Incorrect email or password."
              : error.message
          );
        } else {
          setOpen(false);
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName.trim() },
          },
        });
        if (error) {
          setError(error.message);
        } else {
          setSuccessMsg(
            "Check your email — we sent you a confirmation link. Once confirmed, you're in."
          );
        }
      }
    });
  }

  // ── Google OAuth ───────────────────────────────────────────────────────────
  async function handleGoogleAuth() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  }

  const isLoading = isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton
        className="p-0 max-w-md overflow-hidden border-border-subtle bg-bg-primary"
      >
        {/* ── Visually hidden a11y titles ── */}
        <DialogTitle className="sr-only">
          {mode === "login" ? "Sign in to Tech Nest" : "Create your Tech Nest account"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {mode === "login"
            ? "Enter your credentials to access your account."
            : "Sign up to get personalised recommendations and more."}
        </DialogDescription>

        <div className="p-8">
          {/* ── Header ── */}
          <div className="mb-7 space-y-1">
            <h2 className="text-xl font-semibold text-text-primary tracking-tight">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-sm text-text-secondary">
              {mode === "login"
                ? "Sign in to your Tech Nest account."
                : "Start making smarter technology decisions."}
            </p>
          </div>

          {/* ── Mode Tabs ── */}
          <div className="flex gap-1 p-1 bg-bg-secondary rounded-xl mb-6">
            {(["login", "signup"] as AuthMode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={cn(
                  "flex-1 h-9 rounded-lg text-sm font-medium transition-all duration-200",
                  mode === m
                    ? "bg-surface text-text-primary shadow-sm border border-border-subtle"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              {/* ── Success State ── */}
              {successMsg ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-600 dark:text-emerald-400"
                >
                  {successMsg}
                </motion.div>
              ) : (
                <>
                  {/* ── Fields ── */}
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleEmailAuth(); }}
                    className="space-y-3"
                  >
                  {mode === "signup" && (
                    <AuthInput
                      icon={User}
                      type="text"
                      placeholder="Full name"
                      value={fullName}
                      onChange={setFullName}
                      autoComplete="name"
                      disabled={isLoading}
                    />
                  )}

                  <AuthInput
                    icon={Mail}
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={setEmail}
                    autoComplete="email"
                    disabled={isLoading}
                  />

                  <AuthInput
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={setPassword}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    disabled={isLoading}
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-text-secondary hover:text-text-primary transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />

                  {/* ── Forgot Password ── */}
                  {mode === "login" && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={async () => {
                          if (!email) {
                            setError("Enter your email above first.");
                            return;
                          }
                          const { error } = await supabase.auth.resetPasswordForEmail(email, {
                            redirectTo: `${window.location.origin}/auth/callback?next=/`,
                          });
                          if (error) setError(error.message);
                          else
                            setSuccessMsg("Check your email for a password reset link.");
                        }}
                        className="text-xs text-text-secondary hover:text-text-primary transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* ── Error ── */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Email Submit Button ── */}
                   <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-xl font-semibold mt-1 group"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {mode === "login" ? "Sign In" : "Create Account"}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </Button>
                  </form>

                  {/* ── Divider ── */}
                  <div className="relative my-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border-subtle" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-bg-primary px-3 text-xs text-text-secondary">
                        or continue with
                      </span>
                    </div>
                  </div>

                  {/* ── Google OAuth ── */}
                  <button
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    className={cn(
                      "w-full h-11 rounded-xl border border-border-subtle bg-surface",
                      "flex items-center justify-center gap-3",
                      "text-sm font-medium text-text-primary",
                      "hover:bg-bg-secondary transition-all duration-200",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    <GoogleLogo className="h-4 w-4" />
                    Continue with Google
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── Footer note ── */}
          {mode === "signup" && !successMsg && (
            <p className="mt-5 text-center text-xs text-text-secondary">
              By signing up, you agree to our{" "}
              <span className="underline underline-offset-2 hover:text-text-primary cursor-pointer transition-colors">
                Terms
              </span>{" "}
              and{" "}
              <span className="underline underline-offset-2 hover:text-text-primary cursor-pointer transition-colors">
                Privacy Policy
              </span>
              .
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
