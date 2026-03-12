"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon: React.ElementType;
  state?: "neutral" | "positive" | "warning" | "info";
  delay: number;
}

export function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  state = "neutral",
  delay,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-4xl border border-border bg-foreground/2 p-6 px-7 group hover:bg-foreground/5 transition-all duration-300"
    >
      <div className="absolute -right-3 -top-3 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12">
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            {title}
          </p>
          <div className="w-9 h-9 rounded-2xl bg-foreground/5 flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform">
            <Icon
              className={cn(
                "w-4 h-4 transition-colors",
                state === "positive"
                  ? "text-emerald-400"
                  : state === "warning"
                    ? "text-amber-400"
                    : state === "info"
                      ? "text-blue-400"
                      : "text-muted-foreground",
              )}
            />
          </div>
        </div>
        <div>
          <p className="text-4xl font-bold text-foreground tracking-tight leading-none mb-3">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border",
              state === "positive"
                ? "text-emerald-500 bg-emerald-500/8 border-emerald-500/20"
                : state === "warning"
                  ? "text-amber-500 bg-amber-500/8 border-amber-500/20"
                  : state === "info"
                    ? "text-blue-400 bg-blue-500/8 border-blue-500/20"
                    : "text-muted-foreground bg-foreground/5 border-border",
            )}
          >
            {state === "positive" && <Activity className="w-2.5 h-2.5" />}
            {trend}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
