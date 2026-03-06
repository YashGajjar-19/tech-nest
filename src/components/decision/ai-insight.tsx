"use client";

import * as React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AIInsightProps extends React.HTMLAttributes<HTMLDivElement> {
  summary: string;
  pros?: string[];
  cons?: string[];
  bestFor?: string[];
  avoidIf?: string[];
  isLoading?: boolean;
}

export function AIInsight({
  summary,
  pros = [],
  cons = [],
  bestFor = [],
  avoidIf = [],
  isLoading,
  className,
  ...props
}: AIInsightProps) {
  if (isLoading) {
    return (
      <Card
        className={cn(
          "animate-pulse bg-surface border-border-subtle",
          className,
        )}
        {...props}
      >
        <div className="h-48 w-full bg-bg-secondary rounded-xl" />
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden bg-bg-primary border-border-subtle",
        className,
      )}
      {...props}
    >
      <CardHeader className="border-b border-border-subtle pb-5 bg-surface/50">
        <div className="flex items-center gap-2 text-accent mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wider uppercase">
            Tech Nest Intelligence
          </span>
        </div>
        <CardTitle className="text-xl font-medium leading-relaxed text-text-primary">
          {summary}
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 pt-6">
        {/* Left Column: Pros & Best For */}
        <div className="space-y-6">
          {pros.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold tracking-tight uppercase text-emerald-500 mb-4">
                <CheckCircle2 className="w-4 h-4" />
                Strengths
              </h4>
              <ul className="space-y-3">
                {pros.map((pro, i) => (
                  <li
                    key={i}
                    className="flex items-start text-sm text-text-secondary"
                  >
                    <span className="mr-2 text-emerald-500/50 mt-1">•</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {bestFor.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold tracking-tight uppercase text-text-primary mb-3">
                Ideal For
              </h4>
              <div className="flex flex-wrap gap-2">
                {bestFor.map((persona, i) => (
                  <span
                    key={i}
                    className="inline-flex py-1 px-3 rounded-full bg-accent/10 border border-accent/20 text-xs font-medium text-accent"
                  >
                    {persona}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Cons & Avoid If */}
        <div className="space-y-6 md:border-l md:border-border-subtle md:pl-8">
          {cons.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold tracking-tight uppercase text-rose-500 mb-4">
                <span className="w-4 h-4 flex items-center justify-center rounded-full border border-current text-[10px] font-bold">
                  !
                </span>
                Trade-offs
              </h4>
              <ul className="space-y-3">
                {cons.map((con, i) => (
                  <li
                    key={i}
                    className="flex items-start text-sm text-text-secondary"
                  >
                    <span className="mr-2 text-rose-500/50 mt-1">•</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {avoidIf.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold tracking-tight uppercase text-text-primary mb-3">
                Avoid If
              </h4>
              <ul className="space-y-2">
                {avoidIf.map((reason, i) => (
                  <li key={i} className="text-sm text-text-secondary/80 italic">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
