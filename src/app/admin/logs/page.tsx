import React from "react";

export default function AdminLogsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">System Logs</h1>
        <p className="mt-2 text-white/60">
          Immutable audit trail for all elevated actions.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#000000] p-6 font-mono text-sm text-white/60 min-h-[400px] flex flex-col">
        <div className="border-b border-white/10 pb-4 mb-4 flex gap-4 text-white/40">
          <span className="w-48">TIMESTAMP</span>
          <span className="w-32">ACTOR</span>
          <span className="w-48">ACTION</span>
          <span>DETAILS</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-white/20">
          Awaiting log stream...
        </div>
      </div>
    </div>
  );
}
