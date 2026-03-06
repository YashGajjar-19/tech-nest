"use client";

import React, { useEffect, useState } from "react";
import { fetchSystemLogs } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Shield, Terminal, Filter, RefreshCw, AlertCircle, Info, Zap } from "lucide-react";

const SEVERITY_COLORS: Record<string, string> = {
  info:     "text-blue-400 bg-blue-500/10 border-blue-500/20",
  warning:  "text-amber-500 bg-amber-500/10 border-amber-500/20",
  error:    "text-red-400 bg-red-500/10 border-red-500/20",
  critical: "text-red-500 bg-red-600/20 border-red-600/30 font-bold animate-pulse",
};

const SEVERITY_ICONS: Record<string, React.ElementType> = {
  info:     Info,
  warning:  Zap,
  error:    AlertCircle,
  critical: Shield,
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    const data = await fetchSystemLogs(100);
    setLogs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = severityFilter 
    ? logs.filter(log => log.severity === severityFilter)
    : logs;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-2">Audit Trace</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">System Logs</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg">
            Immutable operation history for all core services and administrative actions.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-foreground/5 rounded-xl p-1 border border-border">
             {['info', 'warning', 'error'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverityFilter(severityFilter === s ? null : s)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    severityFilter === s 
                      ? SEVERITY_COLORS[s]
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  {s}
                </button>
             ))}
          </div>
          <button 
            onClick={loadLogs}
            className="p-2.5 rounded-xl border border-border bg-foreground/5 text-muted-foreground hover:text-foreground transition-all hover:bg-foreground/10"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="rounded-4xl border border-border bg-[#030303] shadow-2xl overflow-hidden relative group">
        {/* Terminal Header */}
        <div className="px-6 py-4 border-b border-border/50 bg-[#0a0a0a] flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                 <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
                 <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest font-bold">
                 <Terminal className="w-3.5 h-3.5" />
                 audit-v2.8 // cluster-01
              </div>
           </div>
           <div className="text-[10px] font-mono text-muted-foreground/30 uppercase font-bold tracking-widest">
              {logs.length} operations stored
           </div>
        </div>

        {/* Log Viewer */}
        <div className="min-h-[500px] max-h-[700px] overflow-y-auto p-2 font-mono text-[11px] leading-relaxed scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-muted-foreground/40 text-left border-b border-white/5 uppercase tracking-tighter">
                <th className="px-4 py-3 font-medium">Timestamp</th>
                <th className="px-4 py-3 font-medium">Severity</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Metadata</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredLogs.map((log, idx) => {
                  const Icon = SEVERITY_ICONS[log.severity] || Info;
                  return (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: idx % 10 * 0.03 }}
                      key={log.id} 
                      className="group border-b border-white/2 hover:bg-white/3 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-zinc-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}.{(new Date(log.timestamp).getMilliseconds()).toString().padStart(3, '0')}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] uppercase font-bold tracking-wider ${SEVERITY_COLORS[log.severity] || SEVERITY_COLORS.info}`}>
                           <Icon className="w-2.5 h-2.5" />
                           {log.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-zinc-300 font-bold whitespace-nowrap">
                        {log.actor}
                      </td>
                      <td className="px-4 py-3.5 text-zinc-400 font-medium">
                        {log.action}
                      </td>
                      <td className="px-4 py-3.5">
                         <div className="flex gap-2">
                           {Object.entries(log.details || {}).map(([key, value]) => (
                             <span key={key} className="text-zinc-600 group-hover:text-zinc-500 transition-colors">
                               {key}=<span className="text-blue-400/70">{JSON.stringify(value)}</span>
                             </span>
                           ))}
                         </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              
              {!loading && filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground/20 italic">
                     No audit records matched the current filter.
                  </td>
                </tr>
              )}

              {loading && logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                     <div className="flex flex-col items-center gap-4">
                        <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Connecting to audit stream...</span>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-border/50 bg-[#0a0a0a] flex items-center justify-between text-[9px] font-mono text-zinc-600">
           <div className="flex gap-4 uppercase font-bold tracking-widest text-[#00ff41]/40">
              <span className="animate-pulse">● LIVE_FEED_CONNECTED</span>
              <span>TLS_VERSION: 1.3</span>
           </div>
           <p>SYSTEM_RECORDS v4.1.0-RC</p>
        </div>
      </div>

      <div className="p-6 rounded-3xl border border-border bg-foreground/2 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
               <Shield className="w-5 h-5 text-amber-500" />
            </div>
            <div>
               <p className="text-xs font-bold text-foreground">Immutability Note</p>
               <p className="text-xs text-muted-foreground mt-0.5">Records are signed and cannot be modified by any administrative entity.</p>
            </div>
         </div>
         <button className="px-4 py-2 rounded-xl border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-foreground/5 transition-colors">
            Export Logs
         </button>
      </div>
    </div>
  );
}

