import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";

export default function CompareExperience() {
  return (
    <section className="relative w-full max-w-5xl mx-auto px-6 py-24 md:py-32">
      {/* Background glow for emphasis */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-text-primary mb-6">
          Compare intelligently. <br />
          <span className="text-text-primary/40">Not just spec sheets.</span>
        </h2>
        <p className="text-[17px] leading-relaxed text-text-primary/50 font-medium">
          Specs tell you the hardware. Tech Nest tells you what it means for you.
          See real-world performance, camera capabilities, and battery life side-by-side.
        </p>
      </div>

      <div className="relative rounded-4xl border border-border-subtle bg-bg-primary backdrop-blur-2xl p-6 md:p-12 shadow-2xl overflow-hidden group">
        
        {/* The VS Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          
          {/* Device 1 */}
          <div className="flex flex-col items-center border border-transparent rounded-2xl transition-all duration-300 ease-calm hover:border-border-subtle hover:bg-text-primary/5 p-6 lg:p-8">
            <div className="w-32 h-40 md:w-48 md:h-64 bg-text-primary/5 rounded-3xl mb-8 flex flex-col items-center justify-center transition-all duration-300 ease-calm shadow-[0_0_40px_rgba(255,255,255,0.03)] group-hover:shadow-premium-md border border-border-subtle relative overflow-hidden">
               <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-20" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-text-primary/90">iPhone 16 Pro</h3>
            <span className="text-sm font-medium text-text-primary/40 mt-1">Apple A18 Pro</span>
          </div>

          {/* VS Divider */}
          <div className="hidden md:flex absolute left-1/2 top-24 -translate-x-1/2 w-14 h-14 bg-bg-primary rounded-full border border-border-subtle items-center justify-center shadow-lg pointer-events-none text-text-primary/40 font-bold font-mono text-sm z-20 transition-all duration-300 ease-calm group-hover:shadow-premium-md group-hover:text-text-primary">
            VS
          </div>

          {/* Device 2 */}
          <div className="flex flex-col items-center border border-transparent rounded-2xl transition-all duration-300 ease-calm hover:border-border-subtle hover:bg-text-primary/5 p-6 lg:p-8">
            <div className="w-32 h-40 md:w-48 md:h-64 bg-text-primary/5 rounded-3xl mb-8 flex flex-col items-center justify-center transition-all duration-300 ease-calm shadow-[0_0_40px_rgba(255,255,255,0.03)] group-hover:shadow-premium-md border border-border-subtle relative overflow-hidden">
               <div className="absolute inset-0 bg-linear-to-tr from-blue-500/10 to-transparent opacity-20" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-text-primary/90">Galaxy S25 Ultra</h3>
            <span className="text-sm font-medium text-text-primary/40 mt-1">Snapdragon 8 Elite</span>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 px-4 relative z-10">
          {[
            { label: "Camera", val1: "48MP Main", val2: "200MP Main" },
            { label: "Performance", val1: "Score: 98", val2: "Score: 97" },
            { label: "Battery", val1: "22h Video", val2: "30h Video" },
            { label: "AI Summary", val1: "Video King", val2: "Zoom Master" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center bg-text-primary/5 rounded-xl p-4 border border-border-subtle">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-text-primary/30 mb-3">{stat.label}</span>
              <div className="flex w-full justify-between items-center text-[13px] font-medium transition-colors text-text-primary/70 group-hover:text-text-secondary">
                <span className="text-left w-1/2">{stat.val1}</span>
                <span className="w-px h-3 bg-text-primary/5 mx-2" />
                <span className="text-right w-1/2">{stat.val2}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="mt-12 flex justify-center">
        <Link 
          href="/compare" 
          className="group flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-full font-semibold hover:bg-accent/90 transition-all duration-300 ease-calm hover:shadow-premium-md shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-transparent dark:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        >
          <Scale className="w-4 h-4" />
          Compare Any Device
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </section>
  );
}
