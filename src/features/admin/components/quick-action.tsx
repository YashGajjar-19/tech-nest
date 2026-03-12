"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export interface QuickActionProps {
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  delay: number;
}

export function QuickAction({
  label,
  description,
  href,
  icon: Icon,
  delay,
}: QuickActionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link
        href={href}
        className="flex items-center justify-between p-4 rounded-2xl border border-border bg-foreground/2 hover:bg-foreground/5 hover:border-foreground/20 transition-all group shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-foreground/5 flex items-center justify-center shrink-0 group-hover:bg-foreground/10 transition-colors border border-border/50">
            <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground tracking-tight">
              {label}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {description}
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground group-hover:translate-x-1 transition-all" />
      </Link>
    </motion.div>
  );
}
