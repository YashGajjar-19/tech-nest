"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, Smartphone, BarChart3, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { HeroIntelligence } from "@/components/home/hero-intelligence";

/* ──────────────────────────────────────────────────────────────
   HOME PAGE — "Dual-Soul" Design
   
   Light: Apple "Product Hero" — generous whitespace, airy shadows
   Dark: Linear "Command Center" — nested depth, accent glows
   
   Layout: Hero → Value Props → CTA
   Rhythm: 8pt grid — 48px section gaps, 16px item gaps
   Center Column: max-width 1200px
   ────────────────────────────────────────────────────────────── */

const RevealCurtain = () => (
  <motion.div 
    className="fixed inset-0 z-[100] pointer-events-none flex flex-col"
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{ duration: 0.1, delay: 2.5 }}
  >
    <motion.div 
      className="w-full h-1/2 bg-black border-b border-white/10"
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    />
    <motion.div 
      className="w-full h-1/2 bg-black border-t border-white/10"
      initial={{ y: 0 }}
      animate={{ y: "100%" }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    />
  </motion.div>
);

function DraftingIcon({ Icon }: { Icon: any }) {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center border border-white/10 bg-black/50">
       <div className="absolute top-0 bottom-0 left-2 w-[1px] bg-white/10 -my-2" />
       <div className="absolute top-0 bottom-0 right-2 w-[1px] bg-white/10 -my-2" />
       <div className="absolute left-0 right-0 top-2 h-[1px] bg-white/10 -mx-2" />
       <div className="absolute left-0 right-0 bottom-2 h-[1px] bg-white/10 -mx-2" />
       <Icon className="relative z-10 w-5 h-5 text-white" strokeWidth={0.75} />
    </div>
  );
}

function MagneticCard({ children, className }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 40; 
    const y = (e.clientY - top - height / 2) / 40;
    setPosition({ x, y });
  };
  
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: -position.y, rotateY: position.x }}
      transition={{ type: "spring", stiffness: 40, damping: 30 }} // Heavy friction lean
      className={`group relative overflow-hidden bg-(--surface) border border-white/5 ${className}`}
      style={{ transformPerspective: 1000 }}
    >
      <div className="absolute inset-0 bg-linear-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col items-center relative bg-black">
      <RevealCurtain />
      
      <HeroIntelligence />

      {/* ── Divider ── */}
      <div className="center-col w-full">
        <div className="border-t border-white/5" />
      </div>

      {/* ── Bento Grid ── */}
      <section className="center-col w-full section-gap">
        <div className="flex w-full justify-center mb-24">
           <h2 className="text-[10px] tracking-[4px] uppercase text-white/40 font-(family-name:--font-geist-mono)">Featured Decisions</h2>
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[700px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Main Hero Card (60%) */}
          <MagneticCard className="lg:col-span-7 rounded-[2px] p-12 flex flex-col justify-between">
            <div>
              <DraftingIcon Icon={Smartphone} />
              <h3 className="mt-12 text-[32px] leading-tight font-extralight tracking-[-0.02em] text-(--text-primary) font-(family-name:--font-geist-sans)">
                Every spec, organized
              </h3>
              <p className="mt-4 text-[15px] font-light leading-[24px] text-(--text-secondary) max-w-[300px]">
                Clean device profiles with the precise specs that strictly impact your workflow. Zero clutter. Focus preserved.
              </p>
            </div>
            {/* Minimal schematic visual placeholder */}
            <div className="w-full h-[60%] border border-white/5 mt-8 bg-[radial-gradient(#14B8A6_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
          </MagneticCard>

          {/* Side Stack (40%) */}
          <div className="lg:col-span-5 flex flex-col gap-6 h-full">
            <MagneticCard className="flex-1 rounded-[2px] p-10 flex flex-col justify-between">
              <div>
                <DraftingIcon Icon={BarChart3} />
                <h3 className="mt-8 text-[24px] leading-tight font-extralight tracking-[-0.02em] text-(--text-primary) font-(family-name:--font-geist-sans)">
                  Side-by-side clarity
                </h3>
                <p className="mt-2 text-[14px] font-light text-(--text-secondary)">
                  Compare devices with analytical precision.
                </p>
              </div>
            </MagneticCard>
            
            <MagneticCard className="flex-1 rounded-[2px] p-10 flex flex-col justify-between">
              <div>
                <DraftingIcon Icon={Zap} />
                <h3 className="mt-8 text-[24px] leading-tight font-extralight tracking-[-0.02em] text-(--text-primary) font-(family-name:--font-geist-sans)">
                  AI-powered insights
                </h3>
                <p className="mt-2 text-[14px] font-light text-(--text-secondary)">
                  Algorithmic recommendations based on your technical priorities.
                </p>
              </div>
            </MagneticCard>
          </div>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="center-col w-full">
        <div className="border-t border-white/5" />
      </div>

      {/* ── Bottom CTA ── */}
      <section className="center-col w-full section-gap text-center">
        <motion.div
           initial={{ opacity: 0, y: 16 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-60px" }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-extralight tracking-[-0.03em] text-(--text-primary) font-(family-name:--font-geist-sans)">
            Ready to find your next phone?
          </h2>

          <p className="mt-6 text-[15px] font-light text-(--text-secondary)">
            No sign-up required. Start comparing instantly.
          </p>

          <div className="mt-12">
            <Link
              href="/phones"
              className="group inline-flex h-12 items-center gap-4 border border-white/20 bg-transparent px-8 text-[11px] tracking-[2px] uppercase text-white transition-all duration-500 hover:bg-white hover:text-black"
            >
              Enter Studio
              <ArrowRight
                className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                strokeWidth={0.75}
              />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
