import {
  Sparkles,
  ArrowRightLeft,
  BookmarkPlus,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

export default function DeviceHero({
  device,
  decision,
}: {
  device?: any;
  decision?: any;
}) {
  // Use fallback data if not provided (for older routes)
  const name = device?.name || "iPhone 16 Pro";
  const brand = device?.brand || "Apple";
  const price = device?.price || 999;
  const score = decision?.tech_nest_score
    ? Math.round(decision.tech_nest_score * 10) / 10
    : 9.2;
  const verdictReason =
    decision?.definitive_reason ||
    "The definitive choice for videographers and power users, offering desktop-class performance in a pocketable titanium frame.";
  const releaseDate = device?.release_date || "Released Sept 2024";

  // Fallback image map
  const FALLBACK_IMAGES: Record<string, string> = {
    dev1: "https://images.unsplash.com/photo-1736691459585-703eaeb720ca?w=800&q=80",
    dev2: "https://images.unsplash.com/photo-1707227155604-bb56df2e2ef9?w=800&q=80",
  };
  const imgUrl =
    device?.image_url || (device?.id ? FALLBACK_IMAGES[device.id] : null);

  return (
    <section className="w-full relative min-h-[90vh] flex flex-col md:flex-row items-center justify-center pt-24 pb-12 bg-background">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Left visual side */}
      <div className="w-full md:w-[45%] h-full hidden md:flex items-center justify-center p-8 lg:p-16 relative z-10">
        <div className="relative w-full max-w-sm aspect-1/2 rounded-4xl bg-surface border border-border-subtle shadow-premium-lg flex items-center justify-center overflow-hidden">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <>
              {/* Glossy reflection effect */}
              <div className="absolute inset-0 bg-linear-to-br from-foreground/5 to-transparent opacity-50 pointer-events-none" />
              <div className="absolute top-6 w-32 h-8 bg-background border rounded-full z-20" />{" "}
              {/* Dynamic Island mockup */}
              <p className="text-muted-foreground font-medium tracking-widest text-sm uppercase z-20">
                Device Render
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right context side */}
      <div className="w-full md:w-[55%] h-full flex flex-col justify-center px-6 lg:pr-24 lg:pl-12 z-10 relative">
        <div className="flex flex-col max-w-2xl mt-12 md:mt-0">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-text-secondary text-xs uppercase tracking-widest font-semibold">
              {brand}
            </span>
            <span className="w-1 h-1 rounded-full bg-border-subtle" />
            <span className="text-text-secondary text-xs font-medium tabular-nums">
              {releaseDate}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-text-primary mb-4">
            {name}
          </h1>

          <div className="text-xl font-medium text-text-secondary mb-8 tabular-nums">
            From ${price}
          </div>

          <div className="flex items-center gap-6 mb-10">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-text-primary/5 border border-border-subtle shadow-sm">
              <span className="text-2xl font-medium tracking-tight text-text-primary tabular-nums">
                {score}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-text-primary text-sm font-medium">
                  Tech Nest Score
                </span>
                {decision?.verdict && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded-full border ${
                      decision.verdict.toUpperCase() === "BUY"
                        ? "bg-text-primary/5 text-text-primary border-border-subtle"
                        : decision.verdict.toUpperCase() === "WAIT"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}
                  >
                    {decision.verdict}
                  </span>
                )}
              </div>
              <span className="text-text-secondary text-xs font-medium flex items-center gap-1.5 uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-text-primary/40" />
                Verified Intelligence
              </span>
            </div>
          </div>

          <div className="pl-4 border-l-2 border-text-primary/20 mb-10">
            <p className="text-text-primary/90 text-sm font-medium leading-relaxed italic">
              "{verdictReason}"
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button className="h-12 px-8 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors active:bg-accent/80 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Ask AI
            </button>
            <button className="h-12 px-6 rounded-full bg-surface border border-border-subtle text-text-primary font-medium text-sm hover:bg-surface-elevated transition-colors active:bg-surface-elevated/50 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4" />
              Compare
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-surface border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-surface-elevated active:bg-surface-elevated/50 transition-colors">
              <BookmarkPlus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
