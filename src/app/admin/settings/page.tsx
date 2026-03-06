"use client";

import React from "react";
import {
  Settings,
  Bell,
  Shield,
  Database,
  Palette,
  ShieldAlert,
  Cpu,
  Heart,
  Share2,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const SECTIONS = [
  {
    icon: Shield,
    title: "Security & Protocols",
    description:
      "Multi-factor authentication, session isolation, and API key orchestration.",
    color: "blue",
  },
  {
    icon: Database,
    title: "Knowledge Vault",
    description:
      "Edge persistence, vector memory TTL, and cold storage synchronization.",
    color: "purple",
  },
  {
    icon: Bell,
    title: "Signal Relays",
    description:
      "Real-time alerting for pipeline jitter, anomalies, and consensus failures.",
    color: "amber",
  },
  {
    icon: Palette,
    title: "Platform Identity",
    description:
      "Neural theme defaults, brand assets, and interface personalization.",
    color: "emerald",
  },
];

export default function AdminSettingsPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-4 h-4 text-zinc-500" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
            Environment
          </p>
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          System Preferences
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Calibrating the operational parameters of the Tech Nest ecosystem.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {SECTIONS.map((s) => (
          <motion.button
            variants={item}
            key={s.title}
            className="flex items-start gap-6 p-8 rounded-[2.5rem] border border-border bg-foreground/1.5 hover:bg-foreground/4 transition-all text-left group shadow-sm backdrop-blur-3xl relative overflow-hidden"
          >
            <div
              className={`w-12 h-12 rounded-2xl bg-foreground/5 border border-border/50 flex items-center justify-center shrink-0 group-hover:bg-foreground/10 transition-colors`}
            >
              <s.icon
                className={`w-5 h-5 text-muted-foreground group-hover:scale-110 transition-transform`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-foreground group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                {s.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-medium opacity-60">
                {s.description}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
              <ArrowRight className="w-3.5 h-3.5 text-foreground" />
            </div>
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-[2.5rem] border border-border bg-foreground/1.5 p-8 shadow-sm backdrop-blur-3xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
            Operational Overrides
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-6 rounded-3xl border border-red-500/10 bg-red-500/5 hover:bg-red-500/8 transition-colors group">
            <div>
              <p className="text-sm font-bold text-foreground">
                Flush Neural Cache
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-tighter">
                Force global re-ingestion
              </p>
            </div>
            <button className="px-5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95">
              Execute
            </button>
          </div>

          <div className="flex items-center justify-between p-6 rounded-3xl border border-border bg-foreground/3 opacity-50 cursor-not-allowed">
            <div>
              <p className="text-sm font-bold text-foreground">
                Factory Recalibration
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-tighter">
                Destroy all knowledge nodes
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-foreground/5 border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Locked
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center pt-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-foreground/2">
          <Heart className="w-3 h-3 text-red-400 fill-current" />
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
            Tech Nest Admin OS — Nucleus Build v4.2.0
          </span>
        </div>
      </div>
    </div>
  );
}
