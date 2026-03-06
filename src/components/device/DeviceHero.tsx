import { Check } from "lucide-react";

export default function DeviceHero() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 pt-16 pb-24">
      <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
        {/* Left: Device Image */}
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="w-64 h-80 bg-card rounded-[2rem] border flex items-center justify-center overflow-hidden relative shadow-lg">
            <span className="text-muted-foreground font-medium text-sm tracking-widest uppercase">
              Pixel 8 Image
            </span>
          </div>
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-2/3 flex flex-col pt-4">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-2">
              Pixel 8
            </h1>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-green-500">89</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">
                Score
              </span>
            </div>
          </div>

          <ul className="flex flex-col gap-3 mb-8">
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground/90 font-medium">
                Best camera in this price range
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground/90 font-medium">
                Clean Android experience
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground/90 font-medium">
                Compact design
              </span>
            </li>
          </ul>

          <div className="text-2xl font-medium text-foreground mb-10">
            ₹49,999
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button className="px-8 py-3.5 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity">
              Compare
            </button>
            <button className="px-6 py-3.5 rounded-full bg-card border text-foreground font-medium text-sm hover:bg-accent transition-colors">
              View Alternatives
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
