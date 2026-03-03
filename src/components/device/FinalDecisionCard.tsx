import { ArrowRight, ShoppingCart } from "lucide-react";

export default function FinalDecisionCard({
  device,
  decision,
}: {
  device?: any;
  decision?: any;
}) {
  const name = device?.name || "iPhone 16 Pro";

  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-24 mb-16 relative">
      <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex flex-col items-center text-center p-12 md:p-16 rounded-4xl bg-surface border border-border-subtle relative z-10 overflow-hidden shadow-premium-lg">
        {/* Gloss overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-foreground/3 to-transparent pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-bg-primary border border-border-subtle flex items-center justify-center mb-8 shadow-sm">
          <ShoppingCart className="w-6 h-6 text-text-primary" />
        </div>

        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-text-primary mb-4">
          Ready to decide?
        </h2>

        <p className="text-[17px] text-text-secondary font-medium max-w-md mx-auto mb-10 leading-relaxed">
          {decision?.verdict === "BUY"
            ? "You've seen the specs, the AI analysis, and the community feedback. Make the move."
            : decision?.verdict === "WAIT"
              ? "The successor is imminent. We recommend holding off, but if you need it now, proceed."
              : "We recommend looking elsewhere based on current market value. Explore alternatives instead."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {decision?.verdict !== "SKIP" && (
            <button className="w-full sm:w-auto px-10 py-4 h-14 rounded-full bg-accent text-accent-foreground font-semibold active:bg-accent/80 transition-colors shadow-md flex items-center justify-center gap-2">
              Buy {name}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            className={`w-full sm:w-auto px-8 py-4 h-14 rounded-full border border-border-subtle font-medium transition-colors flex items-center justify-center ${decision?.verdict === "SKIP" ? "bg-accent text-accent-foreground w-full" : "bg-surface text-text-primary hover:bg-surface-elevated active:bg-surface-elevated/50"}`}
          >
            {decision?.verdict === "SKIP"
              ? "Explore Alternatives"
              : "View Retailers"}
          </button>
        </div>

        <p className="text-xs text-text-secondary/60 mt-8 uppercase tracking-widest font-semibold">
          No affiliate manipulation. Just the facts.
        </p>
      </div>
    </section>
  );
}
