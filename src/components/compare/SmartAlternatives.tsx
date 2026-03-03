"use client";

import React from "react";
import { ArrowRight, Lightbulb } from "lucide-react";

export default function SmartAlternatives() {
  const alternatives = [
    {
      title: "Want better battery on a budget?",
      device: "OnePlus 12",
      reason:
        "Offers massive battery life and significantly faster charging than both, at a much lower price point.",
      price: "from $799",
    },
    {
      title: "Need something smaller?",
      device: "iPhone 16 Pro",
      reason:
        "Gets you 95% of the Pro Max features, including the same camera system, in a much more pocketable form factor.",
      price: "from $999",
    },
    {
      title: "Looking for pure photography AI?",
      device: "Pixel 9 Pro XL",
      reason:
        "Google's computational photography excels in still shots, and its Magic Eraser tools are built directly into the OS.",
      price: "from $1099",
    },
  ];

  return (
    <section className="w-full px-6 lg:px-12 py-24 flex justify-center border-t border-border-subtle">
      <div className="w-full max-w-5xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-medium tracking-tight text-text-primary">
              Smart Alternatives
            </h2>
            <p className="text-text-secondary text-sm">
              Neither of these quite right?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {alternatives.map((alt, index) => (
            <div
              key={index}
              className="flex flex-col p-6 rounded-2xl bg-surface border border-border-subtle hover:border-border-subtle transition-colors group cursor-pointer"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
                {alt.title}
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-2">
                {alt.device}
              </h3>
              <p className="text-text-secondary text-sm font-light leading-relaxed mb-6 flex-grow">
                {alt.reason}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border-subtle w-full mt-auto">
                <span className="text-text-secondary text-sm">{alt.price}</span>
                <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-text-secondary group-hover:bg-surface group-hover:text-accent-foreground transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
