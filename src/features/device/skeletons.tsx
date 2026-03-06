import React from "react";

export function DeviceHeroSkeleton() {
  return (
    <section className="relative w-full min-h-[50vh] flex flex-col items-center pt-[20vh] pb-16 border-b border-border-subtle bg-bg-secondary overflow-hidden animate-pulse">
      <div className="z-10 text-center max-w-4xl px-6 flex flex-col items-center">
        {/* Mock Hardware Image Box */}
        <div className="w-56 h-72 bg-surface rounded-3xl border border-border-subtle mb-12 flex items-center justify-center" />

        {/* Title */}
        <div className="w-64 md:w-96 h-12 bg-surface rounded-md mb-6" />
        {/* Subtitle */}
        <div className="w-48 h-6 bg-surface rounded-md mb-10" />

        {/* Buttons */}
        <div className="flex gap-4 items-center">
          <div className="w-40 h-12 bg-surface rounded-full" />
          <div className="w-32 h-12 bg-surface rounded-full" />
        </div>
      </div>
    </section>
  );
}

export function DeviceScoresSkeleton() {
  return (
    <section className="px-6 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-12 animate-pulse mt-12">
      {/* Core Score Module */}
      <div className="col-span-1 flex flex-col items-center md:items-start justify-center">
        <div className="w-32 h-32 rounded-full bg-surface mb-6 border border-border-subtle" />
        <div className="w-40 h-6 bg-surface mb-3 rounded-md" />
        <div className="w-full h-12 bg-surface rounded-md" />
      </div>

      {/* Detailed Score Breakdown */}
      <div className="col-span-1 md:col-span-2 flex flex-col justify-center space-y-6 bg-surface border border-border-subtle rounded-3xl p-8 lg:p-10">
        <div className="w-32 h-4 bg-bg-secondary rounded-md mb-2" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col space-y-2">
            <div className="w-24 h-4 bg-bg-secondary rounded-md" />
            <div className="w-full h-2 bg-bg-secondary rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function DeviceAIInsightsSkeleton() {
  return (
    <section className="px-6 max-w-5xl mx-auto w-full animate-pulse mt-12">
      <div className="border border-border-subtle rounded-[2.5rem] bg-surface p-10 md:p-16 flex flex-col lg:flex-row gap-12 lg:gap-24">
        <div className="lg:w-1/2">
           <div className="w-24 h-5 bg-bg-secondary rounded-md mb-6" />
           <div className="w-full h-8 bg-bg-secondary rounded-md mb-4" />
           <div className="w-3/4 h-8 bg-bg-secondary rounded-md mb-6" />
           <div className="w-full h-24 bg-bg-secondary rounded-md" />
        </div>
        <div className="lg:w-1/2 space-y-8 flex flex-col justify-center">
           <div className="w-full h-32 bg-bg-secondary rounded-md" />
           <div className="h-px w-full bg-border-subtle" />
           <div className="w-full h-24 bg-bg-secondary rounded-md" />
        </div>
      </div>
    </section>
  );
}

export function DeviceSpecsSkeleton() {
  return (
    <section className="px-6 max-w-6xl mx-auto w-full animate-pulse mt-12">
      <div className="w-48 h-8 bg-surface rounded-md mb-12" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface border border-border-subtle p-8 rounded-4xl">
             <div className="w-8 h-8 bg-bg-secondary rounded-md mb-6" />
             <div className="w-16 h-4 bg-bg-secondary rounded-md mb-2" />
             <div className="w-32 h-6 bg-bg-secondary rounded-md mb-2" />
             <div className="w-48 h-4 bg-bg-secondary rounded-md" />
          </div>
        ))}
      </div>
    </section>
  );
}
