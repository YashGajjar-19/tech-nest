import { BarChart3, Zap, Shield } from "lucide-react";

export function TrustSection() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto w-full border-t border-border-subtle bg-bg-secondary/50 rounded-b-[4rem]">
      <div className="text-center mb-20 max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-6">
          How Tech Nest Scores Devices
        </h2>
        <p className="text-lg text-text-secondary font-light">
          We don't use arbitrary out-of-ten ratings. Our scores are derived
          directly from mathematical architecture and verified market consensus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-surface border border-border-subtle rounded-2xl flex items-center justify-center mb-8 shadow-sm">
            <BarChart3 className="w-8 h-8 text-text-secondary" />
          </div>
          <h3 className="text-xl font-semibold tracking-tight mb-4">
            Specs Analysis
          </h3>
          <p className="text-text-secondary font-medium">
            We analyze hundreds of raw hardware specifications into normalized
            mathematical values.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-surface border border-border-subtle rounded-2xl flex items-center justify-center mb-8 shadow-sm">
            <Zap className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-xl font-semibold tracking-tight mb-4">
            Intelligence Engine
          </h3>
          <p className="text-text-secondary font-medium">
            Our system dynamically calculates performance scores by weighting
            specs against market tier pricing.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-surface border border-border-subtle rounded-2xl flex items-center justify-center mb-8 shadow-sm">
            <Shield className="w-8 h-8 text-text-secondary" />
          </div>
          <h3 className="text-xl font-semibold tracking-tight mb-4">
            AI Insights
          </h3>
          <p className="text-text-secondary font-medium">
            Verified AI explains underlying strengths and weaknesses so you
            understand the "why" behind the score.
          </p>
        </div>
      </div>
    </section>
  );
}
