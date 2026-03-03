import { CheckCircle2, XCircle, ChevronRight, Activity } from "lucide-react";

export default function DecisionSummary({ device, decision }: { device?: any, decision?: any }) {
  const bestFor = decision?.best_for || ["Day-to-day Usability", "General Purpose"];
  const notIdealFor = decision?.not_ideal_for || ["None specifically"];
  
  // Safe default for SSR if decision is missing or loading
  const pillars = decision?.pillars || {};
  const pillarKeys = Object.keys(pillars);

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-16 border-t bg-background">
      <div className="flex flex-col mb-12">
        <h2 className="text-3xl font-medium tracking-tight text-text-primary">
          Decision Matrix
        </h2>
        <p className="text-text-secondary text-sm font-medium mt-2 flex items-center gap-2">
          <Activity className="w-4 h-4 text-text-primary/40" />
          Powered by Tech Nest Intelligence Engine
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Best For */}
        <div className="flex flex-col p-8 rounded-3xl bg-surface border border-border-subtle shadow-[0_0_30px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-5 h-5 text-text-primary/40" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Best For
            </h3>
          </div>
          <ul className="flex flex-col gap-4">
            {bestFor.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-text-secondary leading-relaxed">
                <ChevronRight className="w-4 h-4 text-text-primary/40 shrink-0 mt-1" />
                <span className="text-text-primary font-medium text-15px">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Not Ideal For */}
        <div className="flex flex-col p-8 rounded-3xl bg-surface border border-border-subtle shadow-[0_0_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-destructive/20" />
          <div className="flex items-center gap-3 mb-6">
            <XCircle className="w-5 h-5 text-destructive/60" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Not Ideal For
            </h3>
          </div>
          <ul className="flex flex-col gap-4">
            {notIdealFor.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-text-secondary leading-relaxed">
                <ChevronRight className="w-4 h-4 text-destructive/40 shrink-0 mt-1" />
                <span className="text-text-primary font-medium text-15px">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The 6 Pillars Breakdown */}
      {pillarKeys.length > 0 && (
        <div className="flex flex-col p-8 md:p-12 rounded-3xl bg-surface border border-border-subtle shadow-[0_0_30px_rgba(0,0,0,0.02)]">
          <h3 className="text-xl font-semibold tracking-tight text-text-primary mb-8">Algorithm Breakdown</h3>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            {pillarKeys.map((key) => {
              const pillar = pillars[key];
              const percentage = Math.round((pillar.score / 10) * 100);
              
              // Dynamic color based on score health, muted slightly for calm aesthetic
              let colorLine = "bg-text-primary";
              if (pillar.score < 6) colorLine = "bg-destructive/80";
              else if (pillar.score < 8) colorLine = "bg-amber-500/80";
              else if (pillar.score >= 9) colorLine = "bg-text-primary";

              return (
                <div key={key} className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-semibold capitalize text-text-primary">
                      {key.replace("_", " ")}
                    </span>
                    <span className="text-sm font-semibold text-text-primary tabular-nums">
                      {pillar.score.toFixed(1)} <span className="text-text-secondary">/ 10</span>
                    </span>
                  </div>
                  
                  {/* Progress Bar Container */}
                  <div className="h-1.5 w-full bg-text-primary/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${colorLine} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  <p className="text-xs text-text-secondary mt-1 font-medium leading-relaxed">
                    {pillar.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
