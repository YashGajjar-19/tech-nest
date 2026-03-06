import { CheckCircle2, ChevronLeft, ArrowRightLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { ScoreBar } from "@/components/ui/ScoreBar";

export default function ComparePage({ params }: { params: { slugs: string } }) {
  // Parse slugs dynamically from routing
  const slugPair = params?.slugs || "iphone-16-pro-vs-galaxy-s24-ultra";
  const [deviceASlug, deviceBSlug] = slugPair.split("-vs-");
  
  const deviceA = deviceASlug ? deviceASlug.replace(/-/g, " ").toUpperCase() : "DEVICE A";
  const deviceB = deviceBSlug ? deviceBSlug.replace(/-/g, " ").toUpperCase() : "DEVICE B";

  // Mock scoring differential
  const aScore = 92;
  const bScore = 89;

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
              <div className="w-48 h-64 bg-surface rounded-3xl border border-border-subtle mb-8 flex items-center justify-center relative shadow-[0_20px_50px_rgba(0,0,0,0.08)] group hover:-translate-y-2 transition-transform duration-500">
                 <div className="absolute top-0 w-full h-full bg-linear-to-tr from-accent/5 to-transparent rounded-3xl pointer-events-none" />
                 <span className="text-text-secondary text-xs uppercase tracking-widest font-semibold opacity-50">{deviceA}</span>
              </div>
              
              <h2 className="text-3xl font-semibold text-center tracking-tight mb-2 group-hover:text-amber-500">{deviceA}</h2>
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
              <div className="w-48 h-64 bg-surface rounded-3xl border border-border-subtle mb-8 flex items-center justify-center relative shadow-[0_20px_50px_rgba(0,0,0,0.08)] group hover:-translate-y-2 transition-transform duration-500">
                 <div className="absolute top-0 w-full h-full bg-linear-to-tr from-accent/5 to-transparent rounded-3xl pointer-events-none" />
                 <span className="text-text-secondary text-xs uppercase tracking-widest font-semibold opacity-50">{deviceB}</span>
              </div>
              <h2 className="text-3xl font-semibold text-center tracking-tight mb-2">{deviceB}</h2>
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
               <ScoreBar label="Display Quality" score={94} className="opacity-100" />
               <ScoreBar label="Processing Power" score={98} className="opacity-100" />
               <ScoreBar label="Camera System" score={89} className="opacity-100" />
               <ScoreBar label="Design & Build" score={92} className="opacity-100" />
               <div className="pt-4 border-t border-border-subtle flex justify-between">
                  <span className="font-semibold text-xl tracking-tight">Total Score</span>
                  <span className="font-semibold text-xl">{aScore}</span>
               </div>
            </div>

            <div className="space-y-8 order-1 md:order-2">
               <ScoreBar label="Display Quality" score={93} className="opacity-70 grayscale-20" />
               <ScoreBar label="Processing Power" score={85} className="opacity-70 grayscale-20" />
               <ScoreBar label="Camera System" score={94} className="opacity-70 grayscale-20" />
               <ScoreBar label="Design & Build" score={88} className="opacity-70 grayscale-20" />
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
               The <strong className="font-semibold">{deviceA}</strong> generally outperforms the <strong className="font-semibold">{deviceB}</strong> in sustained processor efficiency and seamless ecosystem integration. However, the {deviceB} is recommended if your priority strictly lies in camera versatility.
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
              <div className="col-span-1 border-l border-border-subtle pl-6">{deviceA}</div>
              <div className="col-span-1 border-l border-border-subtle pl-6">{deviceB}</div>
           </div>

           {[
              { metric: "Processor", a: "A18 Pro (3nm)", b: "Snapdragon 8 Gen 3 for Galaxy" },
              { metric: "Display", a: "6.3\" 120Hz LTPO OLED", b: "6.8\" 120Hz Dynamic AMOLED 2X" },
              { metric: "Battery", a: "3582 mAh · 27W wired", b: "5000 mAh · 45W wired" },
              { metric: "Starting Price", a: "$999 (128GB)", b: "$1299 (256GB)" },
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
