"use client";

import React, { useEffect, useState } from "react";
import {
  Network,
  Zap,
  AlertCircle,
  TrendingUp,
  Cpu,
  Timer,
  Shield,
  BrainCircuit,
  Activity,
} from "lucide-react";
import { fetchIntelligenceMetrics } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminEnginePage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchIntelligenceMetrics();
      if (data && data.status === "success") {
        setMetrics(data.metrics);
      }
      setLoading(false);
    };
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const engineStats = [
    {
      label: "Decisions Synthesized",
      value:
        metrics?.decisions_today !== undefined
          ? metrics.decisions_today.toLocaleString()
          : "...",
      trend: metrics?.trends?.decisions || "+0%",
      icon: Zap,
      color: "#FBBF24",
    },
    {
      label: "Model Confidence",
      value: metrics?.avg_confidence ? `${metrics.avg_confidence}/10` : "...",
      trend: metrics?.trends?.confidence || "+0.0",
      icon: TrendingUp,
      color: "#34D399",
    },
    {
      label: "Models Active",
      value: metrics?.models_in_prod || "2",
      trend: "Optimal",
      icon: Cpu,
      color: "#60A5FA",
    },
    {
      label: "Processing Latency",
      value: metrics?.avg_latency || "124ms",
      trend: "-8ms",
      icon: Timer,
      color: "#A78BFA",
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
          <Shield className="w-4 h-4 text-blue-500" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
            Decision Core
          </p>
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Intelligence Engine
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time oversight of scoring algorithms and autonomous models.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {engineStats.map((s) => (
          <motion.div
            variants={item}
            key={s.label}
            className="rounded-4xl border border-border bg-foreground/1.5 p-7 group hover:bg-foreground/4 transition-all relative overflow-hidden shadow-sm backdrop-blur-3xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-2.5 bg-foreground/5 rounded-2xl border border-border/50 group-hover:bg-foreground/10 transition-colors">
                <s.icon
                  className="w-4 h-4 text-muted-foreground transition-transform group-hover:scale-110"
                  style={{ color: s.color }}
                />
              </div>
              <div
                className={`text-[10px] font-bold uppercase tracking-wider ${s.trend.startsWith("+") || s.trend === "Optimal" ? "text-emerald-500" : "text-red-400"}`}
              >
                {s.trend}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                {s.label}
              </p>
              <p className="text-3xl font-bold text-foreground tracking-tighter">
                {s.value}
              </p>
            </div>

            {/* Visual background element */}
            <div
              className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity blur-2xl"
              style={{ backgroundColor: s.color }}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-[3rem] border border-border bg-foreground/1.5 p-10 flex flex-col items-center justify-center gap-8 min-h-[440px] relative overflow-hidden group shadow-sm backdrop-blur-3xl"
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
            <div className="w-24 h-24 rounded-4xl bg-foreground/5 border border-border flex items-center justify-center relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700">
              <BrainCircuit className="w-12 h-12 text-muted-foreground group-hover:text-amber-400 transition-colors" />
            </div>
            <div className="absolute -inset-6 bg-amber-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="text-center relative z-10 space-y-4">
            <h3 className="text-2xl font-bold text-foreground tracking-tight">
              Consensus Neural Console
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Real-time model weight tuning, A/B testing of scoring algorithms,
              and multi-model consensus visualization is currently being trained
              for production rollout.
            </p>
          </div>

          <div className="flex flex-col items-center gap-5 relative z-10">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-500 font-bold uppercase tracking-[0.2em] shadow-lg shadow-amber-500/5">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              Model Consensus: Online
            </div>

            <button className="px-10 py-4 rounded-2xl bg-foreground text-background text-xs font-bold hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-foreground/10">
              Launch Tuning Engine
            </button>
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
              <Network className="w-4 h-4 text-blue-400" />
              Scoring Topology
            </h3>
            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-[9px] font-bold text-blue-500 uppercase tracking-tighter">
              Deterministic
            </span>
          </div>

          <div className="space-y-4 flex-1">
            {[
              {
                label: "Hardware Normalized",
                value: "99.2%",
                status: "Active",
              },
              {
                label: "Market Sensitivity",
                value: "Medium",
                status: "Calibrated",
              },
              {
                label: "Categorical Bias",
                value: "< 0.01%",
                status: "Minified",
              },
              { label: "Inference Speed", value: "4ms", status: "Optimal" },
            ].map((node) => (
              <div
                key={node.label}
                className="p-4 rounded-2xl bg-foreground/3 border border-border/10 hover:border-border/30 transition-all group/node"
              >
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider opacity-60 mb-1">
                  {node.label}
                </p>
                <div className="flex justify-between items-end">
                  <p className="text-lg font-bold text-foreground">
                    {node.value}
                  </p>
                  <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">
                    {node.status}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border/50">
            <div className="p-4 rounded-2xl bg-foreground/5 border border-border/50 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                Scoring Engine V2.4 Stable
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
