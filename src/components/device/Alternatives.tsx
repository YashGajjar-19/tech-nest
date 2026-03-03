import { ArrowRight } from "lucide-react";

export default function Alternatives() {
  const options = [
    {
      title: "Best Camera Alternative",
      name: "Google Pixel 9 Pro",
      price: "From $999",
      reason:
        "Superior still-photography processing and uncropped AI editing tools.",
    },
    {
      title: "Best Value Alternative",
      name: "iPhone 15 Pro",
      price: "From $899",
      reason:
        "90% of the same experience for less, with slightly inferior video capabilities.",
    },
    {
      title: "Best Android Alternative",
      name: "Samsung S24 Ultra",
      price: "From $1299",
      reason:
        "True multitasking, integrated S-Pen, and a native 10x periscope lens.",
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-16 border-t bg-background">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Alternatives
          </h2>
          <p className="text-muted-foreground text-[15px]">
            If this isn't the perfect fit, consider these class leaders.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {options.map((alt, idx) => (
          <div
            key={idx}
            className={`group relative flex flex-col p-8 rounded-3xl bg-card border hover:border-brand/40 transition-colors overflow-hidden`}
          >
            <div className="flex flex-col h-full relative z-10">
              <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider mb-6">
                {alt.title}
              </span>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                {alt.name}
              </h3>

              <p className="text-[14px] text-muted-foreground leading-relaxed flex-1 italic">
                "{alt.reason}"
              </p>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <span className="text-foreground font-medium text-sm">
                  {alt.price}
                </span>
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-background border text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
