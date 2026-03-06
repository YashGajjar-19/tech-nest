"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Smartphone,
  Cpu,
  Zap,
  CheckCircle2,
  ArrowRight,
  Plus,
  Clock,
  LayoutGrid,
  Activity,
  Package,
  Layers,
  Database,
  BarChart4,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { fetchIntelligenceMetrics } from "@/lib/api";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon: React.ElementType;
  state?: "neutral" | "positive" | "warning" | "info";
  delay: number;
}

function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  state = "neutral",
  delay,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-4xl border border-border bg-foreground/2 p-6 px-7 group hover:bg-foreground/5 transition-all duration-300"
    >
      <div className="absolute -right-3 -top-3 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12">
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            {title}
          </p>
          <div className="w-9 h-9 rounded-2xl bg-foreground/5 flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform">
            <Icon
              className={cn(
                "w-4 h-4 transition-colors",
                state === "positive"
                  ? "text-emerald-400"
                  : state === "warning"
                    ? "text-amber-400"
                    : state === "info"
                      ? "text-blue-400"
                      : "text-muted-foreground",
              )}
            />
          </div>
        </div>
        <div>
          <p className="text-4xl font-bold text-foreground tracking-tight leading-none mb-3">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border",
              state === "positive"
                ? "text-emerald-500 bg-emerald-500/8 border-emerald-500/20"
                : state === "warning"
                  ? "text-amber-500 bg-amber-500/8 border-amber-500/20"
                  : state === "info"
                    ? "text-blue-400 bg-blue-500/8 border-blue-500/20"
                    : "text-muted-foreground bg-foreground/5 border-border",
            )}
          >
            {state === "positive" && <Activity className="w-2.5 h-2.5" />}
            {trend}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function QuickAction({
  label,
  description,
  href,
  icon: Icon,
  delay,
}: {
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link
        href={href}
        className="flex items-center justify-between p-4 rounded-2xl border border-border bg-foreground/2 hover:bg-foreground/5 hover:border-foreground/20 transition-all group shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-foreground/5 flex items-center justify-center shrink-0 group-hover:bg-foreground/10 transition-colors border border-border/50">
            <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground tracking-tight">
              {label}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {description}
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground group-hover:translate-x-1 transition-all" />
      </Link>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({
    totalDevices: 0,
    totalBrands: 0,
    recentDevices: [],
    metrics: null,
    loading: true,
  });

  const loadData = async () => {
    const supabase = createClient();
    const [
      { count: totalDevices },
      { data: recentDevices },
      { count: totalBrands },
      metricsData,
    ] = await Promise.all([
      supabase.from("devices").select("*", { count: "exact", head: true }),
      supabase
        .from("devices")
        .select("id, name, brands(name), updated_at")
        .order("updated_at", { ascending: false })
        .limit(6),
      supabase.from("brands").select("*", { count: "exact", head: true }),
      fetchIntelligenceMetrics(),
    ]);

    setStats({
      totalDevices: totalDevices ?? 0,
      totalBrands: totalBrands ?? 0,
      recentDevices: recentDevices ?? [],
      metrics: metricsData?.status === "success" ? metricsData.metrics : null,
      loading: false,
    });
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-3"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em]">
              Neural Tissue Active
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black text-foreground tracking-tight sm:text-5xl"
          >
            Digital Core
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm text-muted-foreground max-w-lg leading-relaxed font-medium"
          >
            Orchestrating the Tech Nest intelligence layer. Monitor
            high-fidelity device data, autonomous decision flows, and catalog
            growth in real-time.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3"
        >
          <Link
            href="/admin/devices/new"
            className="group flex items-center gap-2 px-6 py-3.5 bg-foreground text-background text-sm font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl hover:shadow-foreground/10 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            Launch Wizard
          </Link>
        </motion.div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Assets"
          value={stats.totalDevices}
          trend={stats.metrics?.trends?.devices || "+0"}
          icon={Smartphone}
          state="neutral"
          delay={0.1}
        />
        <MetricCard
          title="Avg Confidence"
          value={
            stats.metrics?.avg_confidence
              ? `${stats.metrics.avg_confidence}/10`
              : "..."
          }
          trend={stats.metrics?.trends?.confidence || "+0.0"}
          icon={Zap}
          state="positive"
          delay={0.2}
        />
        <MetricCard
          title="Daily Decisions"
          value={stats.metrics?.decisions_today || 0}
          trend={stats.metrics?.trends?.decisions || "+0%"}
          icon={Cpu}
          state="positive"
          delay={0.3}
        />
        <MetricCard
          title="Ecosystem Nodes"
          value={stats.totalBrands}
          trend="Scale Optimized"
          icon={Database}
          delay={0.4}
        />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recently updated devices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 rounded-[3.5rem] border border-border bg-foreground/1.5 overflow-hidden shadow-sm backdrop-blur-3xl"
        >
          <div className="flex items-center justify-between px-10 py-8 border-b border-border/50">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-foreground/5 rounded-xl border border-border/50">
                <Clock className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground tracking-tight">
                  Recent Synchronizations
                </h2>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">
                  Live Database Stream
                </p>
              </div>
            </div>
            <Link
              href="/admin/devices"
              className="px-4 py-2 rounded-xl bg-foreground/5 border border-border text-[10px] font-bold text-muted-foreground hover:text-foreground transition-all hover:bg-foreground/10"
            >
              View Cluster
            </Link>
          </div>

          <div className="p-4">
            {stats.loading ? (
              <div className="p-16 text-center space-y-6">
                <div className="w-10 h-10 border-2 border-foreground/10 border-t-foreground rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
                  Syncing nodes...
                </p>
              </div>
            ) : stats.recentDevices.length === 0 ? (
              <div className="px-10 py-20 text-center">
                <div className="w-20 h-20 bg-foreground/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-border/50">
                  <Smartphone className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <p className="text-lg font-bold text-foreground">
                  Cluster is Empty
                </p>
                <p className="text-sm text-muted-foreground mt-3 max-w-xs mx-auto leading-relaxed">
                  No data points have been ingested yet. Start the
                  synchronization by adding your first device.
                </p>
                <Link
                  href="/admin/devices/new"
                  className="inline-flex items-center gap-2 mt-10 px-8 py-3 bg-foreground text-background text-xs font-bold rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-foreground/10"
                >
                  <Plus className="w-4 h-4" />
                  Add Primary Node
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                <AnimatePresence>
                  {stats.recentDevices.map((d: any, i: number) => (
                    <motion.div
                      key={d.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={`/admin/devices/${d.id}/edit`}
                        className="flex items-center justify-between px-6 py-4 hover:bg-foreground/5 rounded-4xl transition-all duration-300 group border border-transparent hover:border-border/50"
                      >
                        <div className="flex items-center gap-5 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-foreground/3 flex items-center justify-center group-hover:bg-foreground/10 transition-colors border border-border/30">
                            <Smartphone className="w-5 h-5 text-muted-foreground group-hover:scale-110 transition-all duration-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-foreground truncate group-hover:translate-x-0.5 transition-transform">
                              {d.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-[0.2em] font-bold opacity-60">
                              {(d.brands as any)?.name ?? "Unknown Brand"}
                            </p>
                          </div>
                        </div>
                        <div className="ml-6 flex items-center gap-6">
                          <div className="hidden sm:flex flex-col items-end">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">
                              Modified
                            </span>
                            <span className="text-[11px] font-bold text-foreground">
                              {new Date(d.updated_at).toLocaleTimeString([], {
                                hour12: false,
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                            <ArrowRight className="w-3.5 h-3.5 text-foreground" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick actions */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-5xl border border-border bg-foreground/1.5 p-8 space-y-5 shadow-sm backdrop-blur-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-foreground/5 rounded-xl border border-border/50">
                <Layers className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground tracking-tight">
                  Quick Operations
                </h2>
                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-0.5">
                  Common Tasks
                </p>
              </div>
            </div>
            <QuickAction
              label="New Device"
              description="Guided creation wizard"
              href="/admin/devices/new"
              icon={Smartphone}
              delay={0.7}
            />
            <QuickAction
              label="Manufacturers"
              description="Index brand profiles"
              href="/admin/brands"
              icon={Package}
              delay={0.8}
            />
            <QuickAction
              label="Sync Pipeline"
              description="View ingestion stream"
              href="/admin/pipeline"
              icon={Activity}
              delay={0.9}
            />
            <QuickAction
              label="Health Analytics"
              description="System telemetry"
              href="/admin/analytics"
              icon={BarChart4}
              delay={1.0}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-[3rem] bg-foreground text-background p-10 relative overflow-hidden group cursor-pointer shadow-2xl shadow-foreground/20"
          >
            <div className="absolute -right-10 -top-10 opacity-10 group-hover:scale-125 group-hover:rotate-45 transition-all duration-1000 ease-in-out">
              <Zap className="w-64 h-64 rotate-12" />
            </div>

            <div className="relative z-10">
              <p className="text-[10px] font-bold opacity-50 uppercase tracking-[0.4em] mb-6">
                Autonomous OS
              </p>
              <h3 className="text-2xl font-black tracking-tighter mb-3 leading-none">
                Run Global
                <br />
                Inference
              </h3>
              <p className="text-sm opacity-60 leading-relaxed font-medium mb-10 max-w-[200px]">
                Synchronize the entire knowledge graph and rebuild decision
                scores.
              </p>
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest group-hover:gap-5 transition-all">
                Execute Loop{" "}
                <ArrowRight className="w-5 h-5 transition-transform" />
              </div>
            </div>

            <div className="absolute bottom-6 right-8 text-[10px] font-mono font-bold opacity-20 group-hover:opacity-40 transition-opacity">
              INF_NODE_X02
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
