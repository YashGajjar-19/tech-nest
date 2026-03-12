import { fetchDeviceDecision } from "@/lib/api";
import { ScoreBar } from "@/components/data-display/score-bar";

export async function DeviceScores({ slug }: { slug: string }) {
  const decision = await fetchDeviceDecision(slug);
  if (!decision) {
    return <div className="text-center py-12 text-text-secondary">No score data available.</div>;
  }
  
  const score = Math.round(decision.tech_nest_score * 10);
  const metrics = decision.category_scores || {};
  const summary = decision.tech_nest_score > 8.5 ? "Exceptional performance, camera, and display stack defining the modern flagship standard." : "Solid device with balanced features for its price class.";

  return (
    <section className="px-6 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-12 mt-12 animate-in fade-in duration-500">
      
      {/* Core Score Module */}
      <div className="col-span-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
         <div className="w-32 h-32 rounded-full border border-border-subtle shadow-sm flex items-center justify-center mb-6 relative overflow-hidden bg-surface group">
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
            <span className="text-5xl font-semibold tracking-tighter text-text-primary">{score}</span>
         </div>
         
         <h3 className="text-2xl font-semibold tracking-tight mb-3">Tech Nest Score</h3>
         <p className="text-base text-text-secondary leading-relaxed mb-6">
           {summary}
         </p>
      </div>

      {/* Detailed Score Breakdown */}
      <div className="col-span-1 md:col-span-2 flex flex-col justify-center space-y-6 bg-surface border border-border-subtle rounded-3xl p-8 lg:p-10 shadow-sm">
        <h4 className="text-sm font-semibold tracking-wider text-text-secondary uppercase mb-2">Category Breakdown</h4>
        <ScoreBar label="Display Quality" score={Math.round((metrics.Display || metrics.display || 0) * 10)} size="lg" />
        <ScoreBar label="Processing Power" score={Math.round((metrics.Performance || metrics.performance || 0) * 10)} size="lg" />
        <ScoreBar label="Camera System" score={Math.round((metrics.Camera || metrics.camera || 0) * 10)} size="lg" />
        <ScoreBar label="Battery Life" score={Math.round((metrics.Battery || metrics.battery || 0) * 10)} size="lg" />
        <ScoreBar label="Design & Build" score={Math.round((metrics.Design || metrics.design || 0) * 10)} size="lg" />
      </div>

    </section>
  );
}
