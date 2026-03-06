"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Smartphone,
  Tags,
  DatabaseZap,
  BrainCircuit,
  Settings,
  Users,
  BarChart3,
  Network,
  Activity,
  LogOut,
  ChevronRight,
  Shield,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Nav config ────────────────────────────────────────────────

const navGroups = [
  {
    label: "Operations",
    items: [
      { name: "Dashboard",  href: "/admin",          icon: LayoutDashboard },
      { name: "Devices",    href: "/admin/devices",  icon: Smartphone },
      { name: "Brands",     href: "/admin/brands",   icon: Tags },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { name: "Data Pipeline",    href: "/admin/pipeline", icon: DatabaseZap },
      { name: "Decision Engine",  href: "/admin/engine",   icon: Network },
      { name: "AI Insights",      href: "/admin/ai",       icon: BrainCircuit },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Analytics",      href: "/admin/analytics", icon: Activity },
      { name: "Users & Roles", href: "/admin/users",    icon: Users },
      { name: "System Logs",    href: "/admin/logs",      icon: Terminal },
      { name: "Settings",       href: "/admin/settings",  icon: Settings },

    ],
  },
];

// ── Sidebar ───────────────────────────────────────────────────

interface AdminSidebarProps {
  userEmail?: string;
  userInitials?: string;
}

export function AdminSidebar({ userEmail, userInitials = "A" }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="w-64 shrink-0 bg-surface border-r border-border flex flex-col h-screen sticky top-0">

      {/* Logo / brand mark */}
      <div className="h-14 flex items-center px-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 bg-foreground rounded-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
            <span className="text-background font-bold text-[10px] tracking-tight">TN</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-semibold text-foreground tracking-tight">
              Tech Nest
            </span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">
              Admin OS
            </span>
          </div>
        </Link>
      </div>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6 scrollbar-hide">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              {group.label}
            </p>
            <nav className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                // Match exact route or prefix (e.g. /admin/devices/new → active on Devices)
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group",
                      isActive
                        ? "bg-foreground/8 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span className="truncate">{item.name}</span>
                    {isActive && (
                      <ChevronRight className="w-3 h-3 ml-auto text-muted-foreground" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* User + Sign out */}
      <div className="border-t border-border p-3 space-y-1">
        {/* User identity row */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-foreground/10 border border-border flex items-center justify-center text-[11px] font-semibold text-foreground shrink-0">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {userEmail ?? "Admin"}
            </p>
            <p className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
              <Shield className="w-2.5 h-2.5" />
              Administrator
            </p>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-500/8 transition-all duration-150 disabled:opacity-40"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {isSigningOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
