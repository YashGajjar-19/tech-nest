"use client";

import React, { useEffect, useState } from "react";
import { BrainCircuit, Clock, CheckCircle2, AlertCircle, RefreshCw, ChevronRight, Zap, Target, Shield, ArrowRight } from "lucide-react";
import { fetchIntelligenceQueue, fetchIntelligenceMetrics } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_STYLE: Record<string, string> = {
  ready:      "text-emerald-500 bg-emerald-500/5 border-emerald-500/20",
  processing: "text-blue-400 bg-blue-500/5 border-blue-500/20",
  pending:    "text-amber-500 bg-amber-500/5 border-amber-500/20",
  failed:     "text-red-400 bg-red-500/5 border-red-500/20",
  error:      "text-red-400 bg-red-500/5 border-red-500/20",
};

const STATUS_ICON: Record<string, React.ElementType> = {
  ready:      CheckCircle2,
  processing: RefreshCw,
  pending:    Clock,
  failed:     AlertCircle,
  error:      AlertCircle,
};

function formatAge(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

export default function AdminAIPage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [qData, mData] = await Promise.all([
      fetchIntelligenceQueue(),
      fetchIntelligenceMetrics()
    ]);
    setQueue(qData || []);
    if (mData && mData.status === "success") {
      setMetrics(mData.metrics);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-1">
             <BrainCircuit className="w-4 h-4 text-purple-500" />
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Neural Queue</p>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">AI Generation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitoring latent space operations and insight synthesis.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-4 px-6 py-3 rounded-2xl border border-border bg-foreground/3 shadow-sm backdrop-blur-3xl"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Waitlist</span>
            <span className="text-lg font-bold text-foreground leading-none mt-1">
               {metrics?.device_statuses?.pending || 0} <span className="text-xs font-medium text-muted-foreground">Nodes</span>
            </span>
          </div>
          <div className="w-px h-8 bg-border" />
          <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
        </motion.div>
      </div>

      <div className="rounded-[3rem] border border-border bg-foreground/1.5 overflow-hidden shadow-sm backdrop-blur-3xl">
        <div className="px-10 py-8 border-b border-border/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Active Intelligence Stream</p>
          </div>
          <button 
            onClick={() => { setLoading(true); loadData(); }}
            className="p-3 hover:bg-foreground/5 rounded-2xl border border-border/50 transition-all active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="divide-y divide-border/30">
          <AnimatePresence mode="popLayout">
            {queue.length > 0 ? (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="divide-y divide-border/30"
              >
                {queue.map((item, i) => {
                  const status = item.intelligence_status || "pending";
                  const Icon = STATUS_ICON[status] || Clock;
                  return (
                    <motion.div 
                      variants={item}
                      key={item.id} 
                      className="flex items-center gap-6 px-10 py-6 hover:bg-foreground/[0.03] transition-colors group relative overflow-hidden"
                    >
                      <div className="flex-1 min-w-0 flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center shrink-0 group-hover:bg-foreground/10 transition-colors">
                            <Icon className={`w-5 h-5 text-muted-foreground ${status === 'processing' ? 'animate-spin text-blue-400' : ''}`} />
                        </div>
                        <div>
                          <p className="text-base font-bold text-foreground group-hover:translate-x-1 transition-transform">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.1em] mt-0.5 opacity-60">
                            {status === 'ready' ? 'Neural Weighting Complete' : 'Optimizing Decision Vectors'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-10">
                        <span className={`flex items-center gap-2 text-[9px] font-bold px-4 py-1.5 rounded-full border uppercase tracking-widest ${STATUS_STYLE[status] || STATUS_STYLE.pending}`}>
                          {status}
                        </span>
                        
                        <div className="hidden sm:flex flex-col items-end gap-0.5 w-28">
                          <span className="text-[10px] font-bold text-foreground">
                            {formatAge(item.updated_at)}
                          </span>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter opacity-40">Latency</span>
                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2.5 rounded-xl bg-foreground text-background hover:opacity-90 transition-all active:scale-90">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="px-10 py-24 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-foreground/5 border border-border flex items-center justify-center mx-auto opacity-20">
                    <BrainCircuit className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Hydrated</h3>
                  <p className="text-xs text-muted-foreground mt-1">The intelligence queue is currently optimal.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="p-6 rounded-[2.5rem] border border-border bg-emerald-500/5 backdrop-blur-3xl space-y-3 col-span-1 md:col-span-2">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
               </div>
               <p className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em]">Neural Consensus</p>
            </div>
            <p className="text-xs text-emerald-400/70 leading-relaxed font-medium">Nodes marked as <span className="font-bold text-emerald-400 underline decoration-emerald-500/30">READY</span> have achieved full cross-model consensus across scoring, sentiment, and AI nodes.</p>
         </div>

         <div className="p-6 rounded-[2.5rem] border border-border bg-amber-500/5 backdrop-blur-3xl space-y-3 col-span-1 md:col-span-2">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-amber-500" />
               </div>
               <p className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em]">Priority Re-indexing</p>
            </div>
            <p className="text-xs text-amber-500/70 leading-relaxed font-medium">Pending nodes are automatically ingested by the <span className="font-bold text-amber-400">Sweep Worker</span> every 300 seconds to ensure catalog zero-latency.</p>
         </div>
      </div>
    </div>
  );
}
