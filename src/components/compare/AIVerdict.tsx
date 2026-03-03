"use client";

import React from "react";
import { Sparkles, Trophy } from "lucide-react";

export default function AIVerdict() {
  return (
    <section className="w-full px-6 lg:px-12 py-16 flex justify-center border-t border-border-subtle">
      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-indigo-400 tracking-wide uppercase">AI Verdict</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-normal leading-tight tracking-tight text-text-primary mb-8 max-w-3xl">
          The iPhone 16 Pro Max wins for seamless video creation and ecosystem reliability, but the Galaxy S24 Ultra is the undeniable choice for productivity power-users.
        </h2>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 text-text-secondary text-lg font-light leading-relaxed">
          <div>
            <p className="mb-6">
              When evaluating these two titans, the decision rarely comes down to raw specifications. Both are incredibly fast. The <span className="text-text-primary font-medium">iPhone 16 Pro Max</span> continues Apple's legacy of "it just works" refinement. Its video recording capabilities remain untouched, and the ecosystem lock-in makes it the default choice if you own a Mac or Apple Watch.
            </p>
            <div className="mt-8 p-6 rounded-2xl bg-surface border border-border-subtle hover:border-border-subtle transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-5 h-5 text-text-primary" />
                <h3 className="text-text-primary font-medium">Buy the iPhone if...</h3>
              </div>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-text-secondary mt-1">•</span>
                  <span>Video recording is your primary creative medium.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-text-secondary mt-1">•</span>
                  <span>You are deeply invested in the Apple ecosystem.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-text-secondary mt-1">•</span>
                  <span>You prefer long-term, predictable software reliability.</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <p className="mb-6">
              The <span className="text-text-primary font-medium">Galaxy S24 Ultra</span>, however, is a significantly more capable computer in your pocket. With a built-in stylus, Dex support, and aggressive AI integrations, it's built for those who want their phone to do everything. While its camera processing can be aggressive, its zoom capabilities remain unmatched.
            </p>
            <div className="mt-8 p-6 rounded-2xl bg-surface border border-border-subtle hover:border-border-subtle transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-5 h-5 text-text-primary" />
                <h3 className="text-text-primary font-medium">Buy the Galaxy if...</h3>
              </div>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-text-secondary mt-1">•</span>
                  <span>You want maximum productivity and S-Pen utility.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-text-secondary mt-1">•</span>
                  <span>You prefer maximum Android customization.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-text-secondary mt-1">•</span>
                  <span>Extreme camera zoom is important to you.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
