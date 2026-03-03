import React from "react";

export default function AdminDataPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Data & Intelligence</h1>
        <p className="mt-2 text-white/60">
          Monitor the decision engine algorithms and data ingestion pipelines.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/2 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
        <div className="text-white/40 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white">Intelligence Engine Offline</h3>
        <p className="mt-2 text-sm text-white/50 max-w-sm">
          Connect the FastAPI backend to visualize real-time scoring data here.
        </p>
      </div>
    </div>
  );
}
