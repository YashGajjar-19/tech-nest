import { Search, Command, Activity } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full pt-[22vh] pb-[10vh] px-6 flex flex-col items-center overflow-hidden">
      {/* Ambient radial blur (Vercel Style) */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-accent/5 rounded-[100%] blur-[120px] pointer-events-none mix-blend-screen dark:bg-accent/10" />

      <div className="z-10 text-center max-w-4xl w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Primary Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-tight text-text-primary mb-6 leading-[1.05]">
          Find the right tech <br />
          <span className="text-text-secondary">for you.</span>
        </h1>

        <p className="text-xl md:text-2xl text-text-secondary font-light max-w-2xl mb-12">
          Compare devices, explore specs, and get AI-powered recommendations.
        </p>

        {/* Core Global Search Interaction */}
        <div className="w-full max-w-3xl mx-auto mb-10 relative group">
          <div className="absolute inset-0 bg-accent/10 rounded-4xl blur-2xl group-hover:bg-accent/15 transition-colors duration-700 -z-10 translate-y-2 opacity-50 block" />

          <div className="bg-surface/80 backdrop-blur-2xl border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] rounded-[2.5rem] p-3 md:p-4 flex items-center transition-all duration-300 focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent hover:border-text-secondary/50">
            <div className="w-14 h-14 flex items-center justify-center bg-bg-secondary rounded-full shrink-0 text-text-secondary border border-border-subtle group-focus-within:bg-text-primary group-focus-within:text-bg-primary transition-colors duration-500 shadow-sm">
              <Search className="w-6 h-6" />
            </div>

            <input
              type="text"
              placeholder="Search devices or ask a question..."
              className="bg-transparent border-none outline-none grow text-xl md:text-2xl px-6 font-light text-text-primary placeholder:text-text-secondary/60 h-14"
            />

            <div className="hidden sm:flex text-sm text-text-secondary bg-surface font-mono px-4 py-2 rounded-full shrink-0 items-center shadow-sm">
              <Command className="w-4 h-4 mr-1.5" /> K
            </div>
          </div>
        </div>

        {/* Trending Prompts */}
        <div className="flex flex-wrap justify-center items-center gap-3 w-full">
          <span className="text-xs text-text-secondary uppercase tracking-widest font-semibold mr-2 opacity-60 flex items-center">
            <Activity className="w-3.5 h-3.5 mr-2" /> Trending
          </span>
          {[
            "iPhone 15 vs Pixel 8",
            "Best phone under $600",
            "Best battery phone",
          ].map((term) => (
            <button
              key={term}
              className="bg-surface border border-border-subtle hover:border-text-primary text-sm px-5 py-2.5 rounded-full transition-all duration-300 text-text-secondary hover:text-text-primary hover:shadow-sm font-medium"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
