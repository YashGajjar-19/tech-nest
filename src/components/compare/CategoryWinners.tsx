import React from "react";
import { Cpu, Camera, Battery, Smartphone, Settings, DollarSign, Check } from "lucide-react";

export default function CategoryWinners() {
  const categories = [
    {
      id: "performance",
      name: "Performance",
      icon: Cpu,
      winner: "tie",
      reason: "Both are insanely fast.",
    },
    {
      id: "camera",
      name: "Camera",
      icon: Camera,
      winner: "iphone",
      reason: "Superior video & natural tones.",
    },
    {
      id: "battery",
      name: "Battery",
      icon: Battery,
      winner: "iphone",
      reason: "Slight edge in endurance.",
    },
    {
      id: "display",
      name: "Display",
      icon: Smartphone,
      winner: "galaxy",
      reason: "Anti-reflective coating wins.",
    },
    {
      id: "software",
      name: "Software",
      icon: Settings,
      winner: "galaxy",
      reason: "Dex & S-Pen productivity.",
    },
    {
      id: "value",
      name: "Value",
      icon: DollarSign,
      winner: "iphone",
      reason: "Higher resale value.",
    },
  ];

  return (
    <section className="w-full px-6 lg:px-12 py-24 flex justify-center border-t border-border-subtle bg-surface">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-medium tracking-tight text-text-primary mb-4">Quick Breakdown</h2>
          <p className="text-text-secondary">The clear winners across six essential categories.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="p-6 rounded-2xl bg-surface border border-border-subtle flex flex-col justify-between hover:bg-surface transition-colors"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-surface text-text-secondary">
                    <category.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-text-primary">{category.name}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className={`px-3 py-1 rounded-full ${category.winner === "iphone" || category.winner === "tie" ? "bg-accent text-accent-foreground font-medium" : "bg-transparent text-text-secondary border border-border-subtle"}`}>
                    {category.winner === "iphone" && <Check className="w-4 h-4 inline-block mr-1" />}
                    iPhone
                  </span>
                  <span className="text-text-secondary text-xs">VS</span>
                  <span className={`px-3 py-1 rounded-full ${category.winner === "galaxy" || category.winner === "tie" ? "bg-accent text-accent-foreground font-medium" : "bg-transparent text-text-secondary border border-border-subtle"}`}>
                    {category.winner === "galaxy" && <Check className="w-4 h-4 inline-block mr-1" />}
                    Galaxy
                  </span>
                </div>
                
                <div className="text-sm text-text-secondary pt-2 border-t border-border-subtle">
                  <span className="text-text-secondary mr-2 text-xs uppercase tracking-wider font-semibold">Why:</span>
                  {category.reason}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
