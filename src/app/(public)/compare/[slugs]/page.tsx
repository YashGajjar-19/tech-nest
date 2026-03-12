import { CheckCircle2, ChevronLeft, ArrowRightLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { ScoreBar } from "@/components/data-display/score-bar";
import { fetchDeviceById, fetchDeviceDecision } from "@/lib/api";

export default async function ComparePage({ params }: { params: { slugs: string } }) {
  // Parse slugs dynamically from routing
  const slugPair = params?.slugs || "iphone-16-pro-vs-galaxy-s24-ultra";
  const [deviceASlug, deviceBSlug] = slugPair.split("-vs-");
  
  // Fetch device metadata and decision models in parallel
  const [deviceA, deviceB] = await Promise.all([
    fetchDeviceById(deviceASlug),
    fetchDeviceById(deviceBSlug)
  ]);

  const [decisionA, decisionB] = await Promise.all([
    fetchDeviceDecision(deviceASlug),
    fetchDeviceDecision(deviceBSlug)
  ]);
  
  const nameA = deviceA?.name || (deviceASlug ? deviceASlug.replace(/-/g, " ").toUpperCase() : "DEVICE A");
  const nameB = deviceB?.name || (deviceBSlug ? deviceBSlug.replace(/-/g, " ").toUpperCase() : "DEVICE B");

  // Mock scoring differential if backend fails to return scores
  const aScore = decisionA ? Math.round(decisionA.tech_nest_score * 10) : 0;
  const bScore = decisionB ? Math.round(decisionB.tech_nest_score * 10) : 0;

  const aMetrics = decisionA?.category_scores || { display: 0, performance: 0, camera: 0, battery: 0, design: 0 };
  const bMetrics = decisionB?.category_scores || { display: 0, performance: 0, camera: 0, battery: 0, design: 0 };

  const getSpec = (device: any, key: string) => {
    if (!device?.specs) return "N/A";
    const found = Object.keys(device.specs).find(k => k.toLowerCase() === key.toLowerCase());
    return found ? device.specs[found] : "N/A";
  };

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col w-full pb-32">
      {/* 1. CALM INTELLIGENCE LAYOUT: Comparison Hero Workspace */}
      <section className="relative w-full pt-[20vh] pb-20 px-6 border-b border-border-subtle bg-bg-secondary flex flex-col items-center overflow-hidden">
        {/* Abstract separation layer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-5xl flex justify-between items-center mb-8 relative z-10">
          <Link href={`/device/${deviceASlug}`} className="text-text-secondary hover:text-text-primary flex items-center text-sm transition font-medium uppercase tracking-widest bg-surface/50 px-4 py-2 rounded-full border border-border-subtle backdrop-blur-md hover:shadow-sm">
            <ChevronLeft className="w-4 h-4 mr-2" /> Return
          </Link>
          <div className="text-xs uppercase tracking-widest font-bold text-text-secondary/60 bg-text-secondary/10 px-3 py-1 rounded-full">
             Live Comparison Workspace
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center mb-20 relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
          Matchup
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 w-full max-w-5xl relative z-10">
           {/* Device A */}
           <div className="flex-1 flex flex-col items-center animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
              <div className="w-48 h-64 bg-surface rounded-3xl border border-border-subtle mb-8 flex items-center justify-center relative shadow-[0_20px_50px_rgba(0,0,0,0.08)] group hover:-translate-y-2 transition-transform duration-500 overflow-hidden">
                 {deviceA?.image_url ? (
                     <img src={deviceA.image_url} alt={nameA} className="object-cover w-full h-full opacity-80" />
                 ) : (
                     <span className="text-text-secondary text-xs uppercase tracking-widest font-semibold opacity-50">{nameA}</span>
                 )}
              </div>
              
              <h2 className="text-3xl font-semibold text-center tracking-tight mb-2 group-hover:text-amber-500">{nameA}</h2>
              <div className="flex items-center space-x-2">
                 <span className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Tech Nest Score:</span>
                 <span className="text-2xl font-bold bg-text-primary text-surface px-3 py-0.5 rounded shadow-sm leading-none flex items-center">{aScore}</span>
              </div>
           </div>

           {/* VS Badge (Minimal structural separation) */}
           <div className="w-16 h-16 bg-surface-elevated rounded-full border border-border-subtle shadow-sm flex items-center justify-center shrink-0 z-10 animate-in fade-in zoom-in-50 duration-500 delay-300">
              <ArrowRightLeft className="w-6 h-6 text-text-secondary opacity-50" />
           </div>

           {/* Device B */}
           <div className="flex-1 flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
              <div className="w-48 h-64 bg-surface rounded-3xl border border-border-subtle mb-8 flex items-center justify-center relative shadow-[0_20px_50px_rgba(0,0,0,0.08)] group hover:-translate-y-2 transition-transform duration-500 overflow-hidden">
                 {deviceB?.image_url ? (
                     <img src={deviceB.image_url} alt={nameB} className="object-cover w-full h-full opacity-80" />
                 ) : (
                     <span className="text-text-secondary text-xs uppercase tracking-widest font-semibold opacity-50">{nameB}</span>
                 )}
              </div>
              <h2 className="text-3xl font-semibold text-center tracking-tight mb-2">{nameB}</h2>
              <div className="flex items-center space-x-2">
                 <span className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Tech Nest Score:</span>
                 <span className="text-2xl font-bold bg-text-primary text-surface px-3 py-0.5 rounded shadow-sm leading-none flex items-center opacity-80">{bScore}</span>
              </div>
           </div>
        </div>
      </section>

      <div className="h-24"></div>

      {/* 2. THE SCORE SYSTEM: Visual Comparison Grid */}
      <section className="py-12 px-6 max-w-5xl mx-auto w-full">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 items-center mb-24">
            <div className="space-y-8 order-2 md:order-1">
               <ScoreBar label="Display Quality" score={Math.round((aMetrics.Display || aMetrics.display || 0)*10)} className="opacity-100" />
               <ScoreBar label="Processing Power" score={Math.round((aMetrics.Performance || aMetrics.performance || 0)*10)} className="opacity-100" />
               <ScoreBar label="Camera System" score={Math.round((aMetrics.Camera || aMetrics.camera || 0)*10)} className="opacity-100" />
               <ScoreBar label="Design & Build" score={Math.round((aMetrics.Design || aMetrics.design || 0)*10)} className="opacity-100" />
               <div className="pt-4 border-t border-border-subtle flex justify-between">
                  <span className="font-semibold text-xl tracking-tight">Total Score</span>
                  <span className="font-semibold text-xl">{aScore}</span>
               </div>
            </div>

            <div className="space-y-8 order-1 md:order-2">
               <ScoreBar label="Display Quality" score={Math.round((bMetrics.Display || bMetrics.display || 0)*10)} className="opacity-70 grayscale-20" />
               <ScoreBar label="Processing Power" score={Math.round((bMetrics.Performance || bMetrics.performance || 0)*10)} className="opacity-70 grayscale-20" />
               <ScoreBar label="Camera System" score={Math.round((bMetrics.Camera || bMetrics.camera || 0)*10)} className="opacity-70 grayscale-20" />
               <ScoreBar label="Design & Build" score={Math.round((bMetrics.Design || bMetrics.design || 0)*10)} className="opacity-70 grayscale-20" />
               <div className="pt-4 border-t border-border-subtle flex justify-between opacity-70">
                  <span className="font-semibold text-xl tracking-tight">Total Score</span>
                  <span className="font-semibold text-xl">{bScore}</span>
               </div>
            </div>
         </div>

         {/* AI RECOMMENDATION BANNER (The "Decision" element) */}
         <div className="bg-linear-to-r from-surface to-bg-secondary border border-border-subtle rounded-3xl p-10 lg:p-14 relative overflow-hidden shadow-sm animate-in fade-in duration-700">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
            
            <h3 className="text-sm tracking-widest font-semibold uppercase mb-6 flex items-center z-10 relative text-text-secondary">
               <span className="w-2 h-2 rounded-full bg-accent mr-3 shadow-[0_0_10px_currentColor] animate-pulse" /> Final Verdict
            </h3>
            <p className="text-xl md:text-2xl text-text-primary font-light max-w-4xl leading-relaxed z-10 relative tracking-tight">
               The <strong className="font-semibold">{nameA}</strong> scored {aScore} compared to <strong className="font-semibold">{nameB}</strong> at {bScore}. 
               {aScore > bScore ? ` For the best overall experience, ${nameA} is the recommended choice.` : ` ${nameB} is the technically superior option.`}
            </p>
         </div>
      </section>

      <div className="h-16"></div>

      {/* CLEAN SPREADSHEET MAPPING */}
      <section className="py-8 px-6 max-w-5xl mx-auto w-full">
        <h3 className="text-3xl font-semibold tracking-tight mb-12">Hardware Specifications</h3>
        
        <div className="border border-border-subtle rounded-3xl overflow-hidden bg-surface shadow-sm text-base md:text-lg">
           
           <div className="grid grid-cols-3 p-6 border-b border-border-subtle bg-bg-secondary font-semibold text-sm uppercase tracking-widest text-text-secondary">
              <div className="col-span-1">Metric</div>
              <div className="col-span-1 border-l border-border-subtle pl-6">{nameA}</div>
              <div className="col-span-1 border-l border-border-subtle pl-6">{nameB}</div>
           </div>

           {[
              { metric: "Processor", a: getSpec(deviceA, "processor"), b: getSpec(deviceB, "processor") },
              { metric: "Display", a: getSpec(deviceA, "display"), b: getSpec(deviceB, "display") },
              { metric: "Battery", a: getSpec(deviceA, "battery"), b: getSpec(deviceB, "battery") },
              { metric: "Starting Price", a: getSpec(deviceA, "price"), b: getSpec(deviceB, "price") },
           ].map((row, idx) => (
             <div key={idx} className="grid grid-cols-3 p-6 border-b border-border-subtle last:border-b-0 hover:bg-bg-secondary/40 transition duration-300 items-center">
                <div className="col-span-1 font-medium text-text-secondary">{row.metric}</div>
                <div className="col-span-1 border-l border-border-subtle pl-6 text-text-primary font-medium tracking-tight">{row.a}</div>
                <div className="col-span-1 border-l border-border-subtle pl-6 text-text-primary font-medium tracking-tight">{row.b}</div>
             </div>
           ))}

        </div>
      </section>

    </main>
  );
}
