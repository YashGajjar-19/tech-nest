import React from "react";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { createClient } from "@/lib/supabase/server";
import { Search } from "lucide-react";

export const metadata = {
  title: "Admin OS | Tech Nest",
  description: "Internal Intelligence Operating System",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Security gate + get user for UI
  const { user } = await requireAdmin();

  // Fetch display name for sidebar footer
  // Real profiles schema: (id, username, avatar_url, created_at)
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", user.id)
    .single();

  // Fall back: username from profiles, then email prefix from auth, then 'Admin'
  const displayName =
    profile?.username ?? user.email?.split("@")[0] ?? "Admin";
  const displayEmail = user.email ?? displayName;
  const initials = displayName
    .split(/[\s._-]/)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "A";

  return (
    // Force dark mode for the entire admin shell
    <div className="dark">
      <div className="min-h-screen bg-background text-foreground font-sans flex flex-row">

        {/* Sidebar — client component (handles active links, sign-out) */}
        <AdminSidebar
          userEmail={displayEmail}
          userInitials={initials}
        />

        {/* Main area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

          {/* Top bar */}
          <header className="h-14 shrink-0 flex items-center justify-between px-7 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-10">
            {/* Inline search pill */}
            <div className="flex items-center gap-2.5 bg-background border border-border rounded-lg px-3 py-1.5 w-60 text-sm text-muted-foreground hover:border-foreground/20 transition-colors cursor-text">
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="flex-1 text-xs">Search admin…</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-foreground/6 rounded border border-border">
                ⌘K
              </kbd>
            </div>

            {/* Status pill */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                System Healthy
              </span>
            </div>
          </header>

          {/* Scrollable page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
