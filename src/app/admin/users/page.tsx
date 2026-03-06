"use client";

import React from "react";
import {
  Users,
  Shield,
  ShieldAlert,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminUsersPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-emerald-500" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
            Access Control
          </p>
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Identity & Roles
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Super Admin tier. Critical system permissions and security overrides.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-[3rem] border border-border bg-foreground/1.5 p-12 text-center min-h-[440px] flex flex-col items-center justify-center relative overflow-hidden group shadow-sm backdrop-blur-3xl"
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-4xl bg-foreground/5 border border-border flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-500">
            <Users className="w-10 h-10 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="space-y-4 max-w-sm relative z-10">
          <h3 className="text-2xl font-bold text-foreground tracking-tight">
            Access Directory
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The multi-tenant identity mesh is currently being synchronized with
            the Supabase Auth vault. Role assignments will appear once users are
            onboarded.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-4 border-background bg-zinc-800"
                />
              ))}
              <div className="w-8 h-8 rounded-full border-4 border-background bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                +4
              </div>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Active System Admins
            </span>
          </div>

          <button className="px-10 py-4 rounded-2xl bg-foreground text-background text-xs font-bold hover:opacity-90 transition-all hover:scale-[1.02] shadow-xl shadow-foreground/10">
            Invite Core Architect
          </button>
        </div>

        <div className="absolute bottom-10 left-10 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            2FA Enforced System-Wide
          </span>
        </div>
      </motion.div>
    </div>
  );
}
