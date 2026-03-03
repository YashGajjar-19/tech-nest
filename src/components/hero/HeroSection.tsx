"use client";

import HeroHeadline from "./HeroHeadline";
import HeroSearch from "./HeroSearch";
import HeroCTAs from "./HeroCTAs";
import { ArrowDown } from "lucide-react";
import { useScroll, useTransform, motion } from "framer-motion";

export default function HeroSection() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <section className="relative min-h-[85svh] flex flex-col items-center justify-center pt-20 pb-16 md:pt-32 md:pb-24 bg-bg-primary">
      <motion.div
        style={{ opacity }}
        className="relative z-20 w-full max-w-5xl mx-auto text-center px-6"
      >
        <HeroHeadline />
        <HeroSearch />
        <HeroCTAs />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 opacity-40 transition-opacity hover:opacity-100 cursor-default"
      >
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-text-secondary">
          Scroll
        </span>
        <ArrowDown className="w-3.5 h-3.5 text-text-secondary" />
      </motion.div>
    </section>
  );
}
