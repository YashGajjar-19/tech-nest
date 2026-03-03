"use client";

import React from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

export default function DecisionCTA() {
  return (
    <section className="w-full px-6 lg:px-12 py-32 flex justify-center border-t border-border-subtle bg-bg-secondary">
      <div className="w-full max-w-4xl text-center space-y-12">
        <div>
          <h2 className="text-3xl lg:text-5xl font-medium tracking-tight text-text-primary mb-6">
            Ready to make a choice?
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            You've seen the data. Choose the device that fits your lifestyle.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-accent text-accent-foreground font-semibold text-base transition-colors active:bg-accent/80 hover:bg-accent/90">
            <span>Get iPhone 16 Pro Max</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-surface text-text-primary font-semibold text-base transition-colors active:bg-surface-elevated/50 hover:bg-surface-elevated border border-border-subtle">
            <span>Get Galaxy S24 Ultra</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-8">
          <button className="inline-flex items-center gap-2 text-text-secondary hover:text-text-secondary transition-colors text-sm font-medium">
            <RotateCcw className="w-4 h-4" />
            <span>Compare Another Device</span>
          </button>
        </div>
      </div>
    </section>
  );
}
