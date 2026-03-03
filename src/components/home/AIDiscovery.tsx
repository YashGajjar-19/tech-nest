import { Sparkles, Terminal } from "lucide-react";

export default function AIDiscovery() {
  return (
    <section className="relative py-24 px-6 md:py-32 w-full border-t border-border-subtle bg-bg-primary overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,var(--tw-gradient-stops))] from-blue-500/5 via-bg-primary to-bg-primary pointer-events-none" />
      <div className="relative max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Left: Copy */}
        <div className="flex flex-col gap-6 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 w-fit">
            <Sparkles className="h-4 w-4" />
            AI Assistant
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-text-primary leading-tight">
            Discover <br /> What Fits You.
          </h2>
          <p className="text-[17px] text-text-primary/50 leading-relaxed font-medium">
            No endless scrolling. Tell us your needs, your budget, and what
            matters most to you. Our intelligent engine curates the exact
            devices built for your lifestyle.
          </p>
          <div className="mt-4">
            <button className="group px-6 py-3 rounded-xl bg-text-primary/5 border border-border-subtle hover:bg-text-primary/5 transition-colors text-text-primary font-medium flex items-center gap-2">
              Start Discovery
              <Sparkles className="h-4 w-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </button>
          </div>
        </div>

        {/* Right: Interface Preview (Not a chat, just a sleek panel) */}
        <div className="relative w-full rounded-4xl border border-border-subtle bg-bg-primary shadow-[0_0_50px_rgba(59,130,246,0.1)] p-8 overflow-hidden backdrop-blur-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col gap-8 relative z-10">
            {/* Slider Mock */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-text-primary/60">Budget</span>
                <span className="text-blue-400">Under $1,000</span>
              </div>
              <div className="h-1.5 w-full bg-text-primary/5 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-blue-500 rounded-full" />
              </div>
            </div>

            {/* Tags Mock */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-text-primary/60">
                Primary Usage
              </span>
              <div className="flex flex-wrap gap-2">
                {["Photography", "Gaming", "Long Battery", "Lightweight"].map(
                  (tag, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border ${i === 0 ? "bg-text-primary/5 border-border-subtle text-text-primary" : "bg-transparent border-border-subtle text-text-primary/40"}`}
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* Result Mock */}
            <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex gap-4 items-center">
              <div className="w-12 h-16 bg-bg-primary rounded-md border border-border-subtle flex items-center justify-center">
                <Terminal className="w-4 h-4 text-text-primary/20" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[11px] font-bold tracking-wider text-blue-400 uppercase">
                  Top Match
                </div>
                <div className="text-sm font-semibold text-text-primary/90">
                  Pixel 8 Pro
                </div>
                <div className="text-[12px] text-text-primary/50">
                  Hits 4/4 of your requirements
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
