import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      {/* subtle separation */}
      <div className="border-b border-tn-border bg-tn-bg/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-14 items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link href="/" className="tn-h4 tracking-tight text-tn-accent">
                Tech Nest
              </Link>

              {/* Nav */}
              <nav className="hidden items-center gap-5 md:flex">
                <Link
                  href="/"
                  className="tn-body-sm text-tn-text-secondary transition-colors hover:text-tn-text-primary"
                >
                  Home
                </Link>
                <Link
                  href="/phones"
                  className="tn-body-sm text-tn-text-secondary transition-colors hover:text-tn-text-primary"
                >
                  Phones
                </Link>
                <Link
                  href="/compare"
                  className="tn-body-sm text-tn-text-secondary transition-colors hover:text-tn-text-primary"
                >
                  Compare
                </Link>
              </nav>
            </div>

            {/* CENTER */}
            <div className="hidden flex-1 justify-center px-6 md:flex">
              <div className="w-full max-w-md">
                <div className="relative rounded-lg border border-tn-border bg-tn-surface transition-all duration-200 focus-within:border-tn-accent focus-within:shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-tn-text-secondary" />
                  </div>
                  <Input
                    placeholder="Search devices, comparisons..."
                    className="h-9 w-full border-0 bg-transparent pl-9 text-tn-body-sm placeholder:text-tn-text-muted focus-visible:outline-none focus-visible:ring-0"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              <Show when="signed-in">
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-tn-border bg-tn-surface">
                  <UserButton />
                </div>
              </Show>

              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="tn-body-sm text-tn-text-secondary transition-colors hover:text-tn-text-primary">
                    Sign In
                  </button>
                </SignInButton>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
