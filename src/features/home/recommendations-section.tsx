import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export function RecommendationsSection() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto w-full">
       <div className="bg-text-primary rounded-[3rem] p-12 lg:p-20 flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-2xl">
          {/* Ambient Dark Mode / Light Mode flip glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="lg:w-1/2 relative z-10 text-bg-primary">
             <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Need help deciding?</h2>
             <p className="text-xl md:text-2xl font-light opacity-80 mb-12 max-w-lg">
                Share your budget, priorities, and workflow. Our intelligence engine will calculate your perfect match instantly.
             </p>
             
             <Link href="/decision" className="bg-bg-primary text-text-primary font-semibold rounded-full px-10 py-5 hover:bg-surface transition-colors text-lg flex items-center shadow-lg hover:scale-105 duration-300 ease-calm w-fit group cursor-pointer">
                Get Recommendation <Zap className="w-5 h-5 ml-3 text-amber-500 group-hover:animate-pulse" />
             </Link>
          </div>

          <div className="lg:w-1/2 w-full lg:max-w-md relative z-10">
             <div className="bg-bg-primary/10 backdrop-blur-md border border-bg-primary/20 p-8 rounded-4xl flex flex-col gap-4 shadow-xl">
                <div className="text-xs tracking-widest font-semibold uppercase text-bg-primary/60 mb-2">Quick Scenarios</div>
                {[
                   "Best phone under $600",
                   "Best camera phone",
                   "Best gaming phone"
                ].map((q, i) => (
                   <Link href="/decision" key={i} className="bg-bg-primary/90 text-text-primary px-6 py-4 rounded-2xl font-medium flex justify-between items-center hover:bg-surface transition-colors group">
                      {q} <ArrowRight className="w-4 h-4 text-text-secondary group-hover:translate-x-1 transition-transform" />
                   </Link>
                ))}
             </div>
          </div>
       </div>
    </section>
  );
}
