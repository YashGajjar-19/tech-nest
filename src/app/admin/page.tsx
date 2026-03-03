import React from "react";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import {
  TrendingUp,
  Smartphone,
  Cpu,
  Zap,
  CheckCircle2,
  ArrowRight,
  Plus,
  Clock,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ElementType;
  state?: "neutral" | "positive" | "warning";
}

function MetricCard({ title, value, trend, icon: Icon, state = "neutral" }: MetricCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 group hover:bg-surface-elevated transition-colors duration-200">
      <div className="absolute -right-3 -top-3 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity">
        <Icon className="w-20 h-20" />
      </div>
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{title}</p>
          <div className="w-7 h-7 rounded-lg bg-foreground/5 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold text-foreground tracking-tight leading-none">{value}</p>
          <p className={`mt-2 text-xs font-medium flex items-center gap-1.5 ${
            state === "positive" ? "text-emerald-500"
            : state === "warning" ? "text-amber-500"
            : "text-muted-foreground"
          }`}>
            {state === "positive" && <TrendingUp className="w-3 h-3" />}
            {trend}
          </p>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ label, description, href, icon: Icon }: {
  label: string; description: string; href: string; icon: React.ElementType;
}) {
  return (
    <Link href={href} className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background hover:bg-surface hover:border-foreground/15 transition-all group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

export default async function AdminDashboard() {
  const supabase = createAdminClient();

  const [
    { count: totalDevices },
    { data: recentDevices },
    { count: totalBrands },
  ] = await Promise.all([
    supabase.from("devices").select("*", { count: "exact", head: true }),
    supabase
      .from("devices")
      .select("id, name, brand, release_date, updated_at")
      .order("updated_at", { ascending: false })
      .limit(6),
    supabase.from("brands").select("*", { count: "exact", head: true }),
  ]);

  const rows = recentDevices ?? [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Admin OS</p>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">System Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor data health, pipeline status, and intelligence operations.
          </p>
        </div>
        <Link
          href="/admin/devices/new"
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Device
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Devices"
          value={(totalDevices ?? 0).toLocaleString()}
          trend="In database"
          icon={Smartphone}
          state={totalDevices ? "positive" : "neutral"}
        />
        <MetricCard
          title="Brands"
          value={(totalBrands ?? 0).toLocaleString()}
          trend="Manufacturers indexed"
          icon={CheckCircle2}
        />
        <MetricCard
          title="Recently Updated"
          value={rows.length.toString()}
          trend="Last 6 changes"
          icon={Cpu}
        />
        <MetricCard
          title="Pipeline"
          value="Active"
          trend="Supabase connected"
          icon={Zap}
          state="positive"
        />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recently updated devices */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Recently Updated</h2>
            </div>
            <Link href="/admin/devices" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              View All
            </Link>
          </div>

          {rows.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Smartphone className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">No devices yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add your first device to get started.</p>
              <Link
                href="/admin/devices/new"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-foreground text-background text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Device
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {rows.map((d) => (
                <div key={d.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-elevated transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{d.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{d.brand}</p>
                  </div>
                  <div className="ml-4 text-right shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {d.updated_at
                        ? new Date(d.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : "—"}
                    </p>
                    {d.release_date && (
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                        Released {new Date(d.release_date).getFullYear()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
          <h2 className="text-sm font-semibold text-foreground mb-4">Quick Operations</h2>
          <QuickAction label="Add Device" description="Launch guided device wizard" href="/admin/devices/new" icon={Smartphone} />
          <QuickAction label="Manage Brands" description="View and edit brand profiles" href="/admin/brands" icon={CheckCircle2} />
          <QuickAction label="View Pipeline" description="Data ingestion status" href="/admin/pipeline" icon={Zap} />
        </div>
      </div>
    </div>
  );
}
