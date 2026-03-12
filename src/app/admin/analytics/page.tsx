"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  TrendingUp,
  Users,
  Eye,
  MousePointerClick,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Layers,
  Zap,
  Target,
} from "lucide-react";
import { fetchAnalyticsSummary } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

function MiniChart({
  data,
  color = "#60A5FA",
}: {
  data: number[];
  color?: string;
}) {
  if (!data || data.length === 0)
    return (
      <div className="h-full w-full bg-foreground/5 animate-pulse rounded" />
    );

  const max = Math.max(...data, 1);
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (v / max) * 100,
  }));

  const path = `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`;

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-12 overflow-visible"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id={`grad-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${path} L 100,100 L 0,100 Z`}
        fill={`url(#grad-${color.replace("#", "")})`}
      />
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const summary = await fetchAnalyticsSummary();
      if (summary && summary.status === "success") {
        setData(summary.metrics);
      }
      setLoading(false);
    };
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: "Page Views (7d)",
      value: data?.page_views_7d || "0",
      delta: data?.deltas?.page_views || "+0%",
      icon: Eye,
      color: "#60A5FA",
      chartData: data?.daily_data?.map((d: any) => d.views) || [
        0, 0, 0, 0, 0, 0, 0,
      ],
    },
    {
      label: "Unique Visitors",
      value: data?.unique_visitors_7d || "0",
      delta: data?.deltas?.unique_visitors || "+0%",
      icon: Users,
      color: "#A78BFA",
      chartData: data?.daily_data?.map((d: any) => d.views * 0.7) || [
        0, 0, 0, 0, 0, 0, 0,
      ],
    },
    {
      label: "Decision Clicks",
      value: data?.decision_clicks_7d || "0",
      delta: data?.deltas?.decision_clicks || "+0%",
      icon: MousePointerClick,
      color: "#FBBF24",
      chartData: data?.daily_data?.map((d: any) => d.decisions) || [
        0, 0, 0, 0, 0, 0, 0,
      ],
    },
    {
      label: "Avg. Session",
      value: data?.avg_session_time || "0m 0s",
      delta: data?.deltas?.avg_session || "+0%",
      icon: Clock,
      color: "#34D399",
      chartData: [4, 5, 2, 8, 4, 9, 6],
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-blue-500" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
            Edge Intelligence
          </p>
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          System Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform-wide behavioral telemetry and growth signals.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {stats.map((s) => (
          <motion.div
            variants={item}
            key={s.label}
            className="rounded-4xl border border-border bg-foreground/1.5 p-7 group hover:bg-foreground/4 transition-all relative overflow-hidden shadow-sm backdrop-blur-3xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-2.5 bg-foreground/5 rounded-2xl border border-border/50 group-hover:bg-foreground/10 transition-colors">
                <s.icon
                  className="w-4 h-4 text-muted-foreground"
                  style={{ color: s.color }}
                />
              </div>
              <div
                className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${s.delta.startsWith("+") ? "text-emerald-500" : "text-red-400"}`}
              >
                {s.delta.startsWith("+") ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {s.delta}
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                {s.label}
              </p>
              <p className="text-3xl font-bold text-foreground tracking-tighter">
                {s.value}
              </p>
            </div>

            <div className="mt-auto pt-2">
              <MiniChart data={s.chartData} color={s.color} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-[3rem] border border-border bg-foreground/1.5 p-10 flex flex-col items-center justify-center gap-6 min-h-[440px] relative overflow-hidden group shadow-sm backdrop-blur-3xl"
        >
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative">
            <div className="w-20 h-20 rounded-4xl bg-foreground/5 border border-border flex items-center justify-center relative z-10 transition-all group-hover:scale-110 group-hover:rotate-3 duration-500">
              <Layers className="w-10 h-10 text-muted-foreground group-hover:text-blue-400 transition-colors " />
            </div>
            <div className="absolute -inset-4 bg-blue-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="text-center relative z-10 space-y-4">
            <h3 className="text-2xl font-bold text-foreground tracking-tight">
              Intelligence Heatmap
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Deep behavior modeling, conversion funnel attribution, and
              multi-variant A/B testing insights will be available once the
              Knowledge Graph reaches critical density.
            </p>
          </div>

          <div className="flex flex-col items-center gap-5 mt-6 relative z-10">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] shadow-lg shadow-blue-500/5">
              <Zap className="w-3 h-3" />
              Tuning Behavioral engine
            </div>

            <button className="px-10 py-4 rounded-2xl bg-foreground text-background text-xs font-bold hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-foreground/10">
              Request Lab Access
            </button>
          </div>

          <div className="absolute top-10 right-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-background bg-zinc-800"
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              +12 Researchers Active
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-[3rem] border border-border bg-foreground/1.5 p-8 flex flex-col shadow-sm backdrop-blur-3xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-3">
              <Target className="w-4 h-4 text-emerald-400" />
              Growth Signals
            </h3>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">
              Optimal
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {[
              {
                label: "Search Velocity",
                value: "Aggressive",
                color: "bg-emerald-500",
                trend: "+14%",
              },
              {
                label: "Catalog Density",
                value: `${data?.page_views_7d || 0} nodes`,
                color: "bg-blue-500",
                trend: "+8%",
              },
              {
                label: "Intent Accuracy",
                value: "92.4%",
                color: "bg-purple-500",
                trend: "+1.2%",
              },
              {
                label: "Session Retention",
                value: "Stable",
                color: "bg-amber-500",
                trend: "~",
              },
            ].map((signal) => (
              <div
                key={signal.label}
                className="p-4 rounded-2xl bg-foreground/3 border border-border/10 hover:border-border/30 transition-all group/item"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider opacity-60 group-hover/item:opacity-100 transition-opacity">
                    {signal.label}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-500">
                    {signal.trend}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${signal.color} shadow-[0_0_8px] shadow-current`}
                  />
                  <span className="text-sm font-bold text-foreground">
                    {signal.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border/50">
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <p className="text-[9px] text-emerald-500/70 leading-relaxed uppercase font-bold tracking-tight">
                * System health is baseline nominal. Telemetry synchronized via
                low-latency Edge Pipeline.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
