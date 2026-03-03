import React from "react";
import {
  Play,
  Pause,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

const PIPELINE_TASKS = [
  {
    id: "1",
    name: "GSMArena Daily Scrape",
    source: "Source: Core",
    status: "running",
    records: 42,
    errors: 0,
    time: "2m 14s",
  },
  {
    id: "2",
    name: "Reddit Sentiment Analysis",
    source: "Source: Community",
    status: "completed",
    records: 1542,
    errors: 2,
    time: "14m 30s",
  },
  {
    id: "3",
    name: "Geekbench Score Sync",
    source: "Source: Benchmarks",
    status: "failed",
    records: 89,
    errors: 89,
    time: "0m 45s",
  },
  {
    id: "4",
    name: "Apple Specs Update (Official)",
    source: "Source: Verified",
    status: "idle",
    records: 0,
    errors: 0,
    time: "-",
  },
];

export default function AdminPipelinePage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
            Intelligence Pipeline
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Monitor and control the data ingestion and transformation loops.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#252525] border border-zinc-800 text-sm font-medium text-zinc-300 rounded-md transition-colors">
            <RefreshCw className="w-4 h-4" />
            Restart Workers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Health & Stats (Left Column) */}
        <div className="space-y-6">
          <div className="bg-[#141414] border border-zinc-800/50 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-zinc-200">
              Global Pipeline Health
            </h2>

            <div className="flex items-end gap-3 pb-4 border-b border-zinc-800/50">
              <div className="text-4xl font-bold text-emerald-400 tracking-tight">
                99.8%
              </div>
              <div className="text-xs text-zinc-500 font-medium pb-1.5 uppercase tracking-wide">
                Uptime (7d)
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Total Records Ingested</span>
                <span className="text-zinc-200 font-mono">1.42M</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Errors (24h)</span>
                <span className="text-amber-400 font-mono">89</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Avg Processing Time</span>
                <span className="text-zinc-200 font-mono">1.2s</span>
              </div>
            </div>
          </div>

          <div className="bg-[#141414] border border-zinc-800/50 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-zinc-200">System Logs</h2>
            <div className="bg-[#0a0a0a] rounded-lg border border-zinc-800 p-3 flex flex-col gap-2 font-mono text-[10px] h-48 overflow-y-auto">
              <div className="text-zinc-500">
                12:45:01 <span className="text-emerald-500">[INFO]</span> Worker
                3 connected to DB.
              </div>
              <div className="text-zinc-500">
                12:45:05 <span className="text-emerald-500">[INFO]</span>{" "}
                Starting job: Reddit Sentiment Analysis queue#143
              </div>
              <div className="text-zinc-500">
                12:46:12 <span className="text-emerald-500">[INFO]</span>{" "}
                Successfully parsed 400 threads.
              </div>
              <div className="text-zinc-500">
                12:47:00 <span className="text-red-400">[ERROR]</span> Benchmark
                sync failed: Timeout external API (api.geekbench.com)
              </div>
              <div className="text-zinc-500">
                12:47:01 <span className="text-amber-400">[WARN]</span> Retrying
                job: Geekbench Score Sync (1/3)
              </div>
              <div className="text-zinc-500 flex items-center gap-2 mt-auto text-zinc-600 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                Waiting for stdout...
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Pipeline Queue (Right Column) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-200 px-1">
            Active Pipeline Tasks
          </h2>

          <div className="bg-[#141414] border border-zinc-800/50 rounded-xl overflow-hidden shadow-sm divide-y divide-zinc-800/50">
            {PIPELINE_TASKS.map((task) => (
              <div
                key={task.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-800/20 transition-colors group"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">
                    {task.status === "running" && (
                      <RefreshCw className="w-5 h-5 text-brand-400 animate-spin" />
                    )}
                    {task.status === "completed" && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                    {task.status === "failed" && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    {task.status === "idle" && (
                      <div className="w-5 h-5 rounded-full border-2 border-zinc-700"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-zinc-200 group-hover:text-brand-400 transition-colors cursor-pointer">
                      {task.name}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {task.source}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between sm:justify-end flex-1 pl-8 sm:pl-0">
                  <div className="text-right flex flex-col gap-0.5">
                    <span className="text-xs font-mono text-zinc-300">
                      {task.records}{" "}
                      <span className="text-zinc-600 font-sans">records</span>
                    </span>
                    <span
                      className={`text-[10px] font-mono ${task.errors > 0 ? "text-red-400" : "text-zinc-600"}`}
                    >
                      {task.errors} errors
                    </span>
                  </div>

                  <div className="text-right w-16">
                    <span className="text-xs font-mono text-zinc-400">
                      {task.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {task.status === "running" ? (
                      <button
                        className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded transition-colors"
                        title="Pause"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        className="p-1.5 text-zinc-400 hover:text-brand-400 hover:bg-zinc-800 rounded transition-colors"
                        title="Run"
                      >
                        <Play className="w-4 h-4 ml-0.5" />
                      </button>
                    )}
                    <button className="p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
