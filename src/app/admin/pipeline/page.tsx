"use client";

import React, { useEffect, useState } from "react";
import {
  Play,
  Pause,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
  Database,
  Activity,
  Box,
  Radio,
  Shield,
  Zap,
  Cpu,
  Terminal,
  ArrowRight
} from "lucide-react";
import {
  fetchIntelligenceMetrics,
  triggerBulkIntelligence,
  triggerNetworkAggregation,
} from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPipelinePage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [runningTask, setRunningTask] = useState<string | null>(null);

  const loadMetrics = async () => {
    const data = await fetchIntelligenceMetrics();
    if (data && data.status === "success") {
      setMetrics(data.metrics);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRunTask = async (taskId: string) => {
    setRunningTask(taskId);
    let success = false;

    if (taskId === "intelligence") {
      success = await triggerBulkIntelligence();
    } else if (taskId === "network") {
      success = await triggerNetworkAggregation();
    }

    setTimeout(() => {
      setRunningTask(null);
      loadMetrics();
    }, 2000);
  };

  const tasks = [
    {
      id: "intelligence",
      name: "Intelligence Pipeline Sync",
      source: "Scoring & AI Insights",
      status: metrics?.device_statuses?.processing > 0 ? "running" : "idle",
      records: metrics?.total_specs || 0,
      errors: metrics?.device_statuses?.failed || 0,
      time: "Delta sync active",
      icon: Cpu,
      color: "blue"
    },
    {
      id: "network",
      name: "Market Signal Aggregator",
      source: "Trend & Sentiment Engine",
      status: runningTask === "network" ? "running" : "idle",
      records: metrics?.total_events || 0,
      errors: 0,
      time: "15m Interval",
      icon: Activity,
      color: "emerald"
    },
    {
      id: "search",
      name: "Knowledge Vector Index",
      source: "Semantic Memory Store",
      status: "idle",
      records: metrics?.total_specs || 0,
      errors: 0,
      time: "Continuous",
      icon: Database,
      color: "purple"
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Synapse Layer</p>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">System Infrastructure</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Orchestrating the data flow between reality and intelligence.
          </p>
        </motion.div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadMetrics()}
            className="group flex items-center gap-2 px-5 py-2.5 bg-foreground/5 hover:bg-foreground/10 border border-border rounded-2xl text-[10px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-all active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Telemetry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Health & Logs */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[2.5rem] border border-border bg-foreground/1.5 p-8 shadow-sm backdrop-blur-3xl space-y-8"
          >
            <div className="flex items-center justify-between">
               <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Global Capacity</h2>
               <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[9px] font-bold text-emerald-500 tracking-tighter uppercase">Optimal</div>
            </div>

            <div className="flex items-end gap-3 pb-6 border-b border-border/50">
              <div className="text-6xl font-bold text-foreground tracking-tighter">
                {metrics?.pipeline_uptime || "99.9%"}
              </div>
              <div className="text-[10px] text-muted-foreground font-bold pb-2 uppercase tracking-[0.1em]">
                Uptime
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Knowledge Nodes", value: metrics?.total_specs || 0, color: "text-blue-400" },
                { label: "Telemetry Events", value: (metrics?.total_events || 0).toLocaleString(), color: "text-purple-400" },
                { label: "Ready Consensus", value: metrics?.device_statuses?.ready || 0, color: "text-emerald-400" },
                { label: "System Failures", value: metrics?.device_statuses?.failed || 0, color: "text-red-400" },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-center text-xs font-bold">
                  <span className="text-muted-foreground uppercase tracking-wider opacity-60">{stat.label}</span>
                  <span className={`${stat.color} font-mono`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-[2.5rem] border border-border bg-foreground/1.5 p-8 shadow-sm backdrop-blur-3xl space-y-6"
          >
            <div className="flex items-center justify-between">
               <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Raw Telemetry</h2>
               <Terminal className="w-3.5 h-3.5 text-muted-foreground opacity-40" />
            </div>
            
            <div className="bg-black/40 rounded-3xl border border-white/5 p-5 flex flex-col gap-3 font-mono text-[10px] h-64 overflow-y-auto custom-scrollbar">
              {metrics?.device_statuses?.processing > 0 && (
                <div className="text-blue-400 flex gap-2">
                  <span className="animate-pulse shrink-0">[SYNC]</span>
                  <span>Pipeline active for {metrics.device_statuses.processing} objects...</span>
                </div>
              )}
              <div className="text-zinc-500">
                [INFO] Found {metrics?.total_specs || 0} valid nodes.
              </div>
              <div className="text-zinc-500">
                [INFO] Tracking {metrics?.active_sessions || 0} active sessions.
              </div>
              <div className="text-zinc-400">
                [TASK] Aggregating market signals...
              </div>
              {metrics?.device_statuses?.failed > 0 && (
                <div className="text-red-400/80">
                  [WARN] {metrics.device_statuses.failed} nodes failed consensus.
                </div>
              )}
              <div className="text-zinc-600 flex items-center gap-2 mt-auto italic">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span>
                Waiting for edge events...
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Task Queue */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
          >
             <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] px-4 mb-4">Active System Tasks</h2>
             <motion.div 
               variants={container}
               initial="hidden"
               animate="show"
               className="rounded-[3rem] border border-border bg-foreground/1.5 overflow-hidden shadow-sm backdrop-blur-3xl divide-y divide-border/30"
             >
               {tasks.map((task) => (
                 <motion.div
                   variants={item}
                   key={task.id}
                   className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-foreground/[0.03] transition-colors group"
                 >
                   <div className="flex items-start gap-5 flex-1">
                     <div className="mt-1">
                       {task.status === "running" ? (
                         <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                       ) : (
                         <div className={`p-3 rounded-2xl bg-foreground/5 border border-border/50 group-hover:bg-foreground/10 transition-colors`}>
                            <task.icon className={`w-5 h-5 text-muted-foreground group-hover:scale-110 transition-transform`} />
                         </div>
                       )}
                     </div>
                     <div>
                       <h3 className="text-base font-bold text-foreground group-hover:text-blue-400 transition-colors">
                         {task.name}
                       </h3>
                       <p className="text-xs text-muted-foreground mt-0.5 font-medium opacity-60 tracking-tight">
                         {task.source}
                       </p>
                     </div>
                   </div>

                   <div className="flex items-center gap-10 justify-between sm:justify-end flex-1">
                     <div className="text-right flex flex-col gap-0.5">
                       <span className="text-xs font-bold text-foreground">
                         {task.records}{" "}
                         <span className="text-muted-foreground font-medium opacity-40 uppercase tracking-tighter">Assets</span>
                       </span>
                       <span
                         className={`text-[9px] font-bold uppercase tracking-widest ${task.errors > 0 ? "text-red-400" : "text-emerald-500/50"}`}
                       >
                         {task.errors} Problems
                       </span>
                     </div>

                     <div className="text-right w-28 hidden sm:block">
                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] opacity-40">
                         {task.time}
                       </span>
                     </div>

                     <div className="flex items-center gap-2">
                       <button
                         disabled={task.status === "running"}
                         onClick={() => handleRunTask(task.id)}
                         className="p-3 bg-foreground/5 hover:bg-foreground/10 border border-border rounded-2xl text-muted-foreground hover:text-foreground transition-all disabled:opacity-50 active:scale-90"
                         title="Run Synchronous Sync"
                       >
                         <Play className="w-4 h-4 fill-current" />
                       </button>
                       <button className="p-3 bg-foreground/5 hover:bg-foreground/10 border border-border rounded-2xl text-muted-foreground hover:text-foreground transition-all active:scale-90">
                         <ArrowRight className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                 </motion.div>
               ))}
             </motion.div>
          </motion.div>

          {/* Infrastructure Notice */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-[2.5rem] bg-blue-500/5 border border-blue-500/20 p-8 flex gap-6 shadow-lg shadow-blue-500/5"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
               <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-foreground font-bold leading-none">
                Autonomous Scheduling Active
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The high-performance APScheduler is managing all recurring tasks. 
                Network aggregation occurs every 15 minutes via the edge worker poll. 
                Any errors during synchronization are automatically retried up to 3 times.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
