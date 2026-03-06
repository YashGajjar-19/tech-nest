import { ChevronRight } from "lucide-react";

export default function ComparisonEntry() {
  const comparisons = ["Galaxy S24", "iPhone 15", "OnePlus 12"];

  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-16 border-t">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground">
          Compare Pixel 8 with
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {comparisons.map((device, idx) => (
          <button
            key={idx}
            className="w-full flex justify-between items-center p-5 rounded-2xl bg-card border hover:bg-accent transition-colors cursor-pointer group"
          >
            <span className="text-foreground font-medium text-[15px]">
              {device}
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        ))}
      </div>
    </section>
  );
}
