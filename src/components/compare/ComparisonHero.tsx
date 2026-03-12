"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Share, Check, ArrowRight } from "lucide-react";

import { fetchDeviceById } from "@/lib/api";

export default function ComparisonHero({ slugA, slugB }: { slugA?: string, slugB?: string }) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Transition to sticky when scrolled past a certain point
      setIsSticky(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [deviceA, setDeviceA] = useState<any>(null);
  const [deviceB, setDeviceB] = useState<any>(null);

  useEffect(() => {
    async function load() {
      if (slugA) setDeviceA(await fetchDeviceById(slugA));
      if (slugB) setDeviceB(await fetchDeviceById(slugB));
    }
    load();
  }, [slugA, slugB]);

  const nameA = deviceA?.name || "iPhone 16 Pro Max";
  const nameB = deviceB?.name || "Galaxy S24 Ultra";
  const priceA = deviceA?.specs?.price ? `$${deviceA.specs.price}` : "Starting at $1199";
  const priceB = deviceB?.specs?.price ? `$${deviceB.specs.price}` : "Starting at $1299";
  const imgA = deviceA?.image_url || null;
  const imgB = deviceB?.image_url || null;

  return (
    <>
      <div className="relative w-full pt-32 pb-16 px-6 lg:px-12 flex flex-col items-center max-w-7xl mx-auto z-10">
        <div className="w-full flex justify-between items-center mb-16">
          <div className="flex-1 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-text-primary mb-4">
                Which flagship is right for you?
              </h1>
              <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto font-light">
                An expert comparison between the {nameA} and {nameB}.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:gap-16 w-full max-w-5xl mx-auto relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-linear-to-b from-transparent via-border-subtle to-transparent"></div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-elevated shadow-sm border border-border-subtle flex items-center justify-center z-10 text-text-secondary text-sm font-medium">
            VS
          </div>

          {/* Device 1 */}
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-3/4 max-w-[280px] bg-surface rounded-3xl border border-border-subtle flex items-center justify-center p-8 mb-8 overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-br from-zinc-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              {/* Dummy Image Placeholder */}
              <div className="w-full h-full rounded-3xl bg-surface-elevated relative shadow-2xl overflow-hidden flex items-center justify-center border-[6px] border-border-subtle">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1/3 h-4 bg-surface rounded-full"></div>
                {imgA ? (
                  <img src={imgA} alt={nameA} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-text-secondary font-medium px-4 text-center">
                    {nameA}
                  </div>
                )}
              </div>
            </div>

            <div className="text-center w-full relative">
              <div className="inline-flex items-center space-x-2 text-xs font-medium px-2.5 py-1 rounded-full bg-surface text-text-primary border border-border-subtle mb-4 transition-colors hover:border-border-subtle cursor-pointer">
                <span>CHANGE DEVICE</span>
                <ChevronDown className="w-3 h-3" />
              </div>
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-text-primary mb-1">
                {nameA}
              </h2>
              <div className="text-text-secondary mb-4">{priceA}</div>

              <div className="mt-6 p-4 rounded-xl bg-surface border border-border-subtle text-left">
                <div className="text-[10px] font-semibold tracking-wider uppercase text-text-secondary mb-1">
                  Highlight
                </div>
                <div className="text-sm text-text-primary">
                  Unrivaled video recording and ecosystem integration.
                </div>
              </div>
            </div>
          </div>

          {/* Device 2 */}
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-3/4 max-w-[280px] bg-surface rounded-3xl border border-border-subtle flex items-center justify-center p-8 mb-8 overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-bl from-zinc-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              {/* Dummy Image Placeholder */}
              <div className="w-full h-full rounded-2xl bg-surface-elevated relative shadow-2xl overflow-hidden flex items-center justify-center border-2 border-border-subtle">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-surface rounded-full"></div>
                {imgB ? (
                  <img src={imgB} alt={nameB} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-text-secondary font-medium text-center px-4">
                    {nameB}
                  </div>
                )}
              </div>
            </div>

            <div className="text-center w-full relative">
              <div className="inline-flex items-center space-x-2 text-xs font-medium px-2.5 py-1 rounded-full bg-surface text-text-primary border border-border-subtle mb-4 transition-colors hover:border-border-subtle cursor-pointer">
                <span>CHANGE DEVICE</span>
                <ChevronDown className="w-3 h-3" />
              </div>
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-text-primary mb-1">
                {nameB}
              </h2>
              <div className="text-text-secondary mb-4">{priceB}</div>

              <div className="mt-6 p-4 rounded-xl bg-surface border border-border-subtle text-left">
                <div className="text-[10px] font-semibold tracking-wider uppercase text-text-secondary mb-1">
                  Highlight
                </div>
                <div className="text-sm text-text-primary">
                  The ultimate productivity machine with S-Pen support.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-center items-center gap-4 mb-20 px-6">
        <button className="flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-accent text-accent-foreground font-medium text-sm transition-colors active:bg-accent/80 hover:bg-accent/90">
          <Plus className="w-4 h-4" />
          <span>Add Device</span>
        </button>
        <button className="flex items-center justify-center gap-2 h-12 w-12 rounded-full bg-surface text-text-primary border border-border-subtle transition-colors hover:bg-surface focus:outline-none active:bg-surface/50">
          <Share className="w-4 h-4" />
        </button>
      </div>

      {/* Sticky Header that fades in when scrolled */}
      <AnimatePresence>
        {isSticky && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 left-0 right-0 h-20 bg-bg-primary/70 backdrop-blur-2xl border-b border-border-subtle z-50 flex items-center justify-between px-6 lg:px-12"
          >
            <div className="flex items-center gap-8 w-full max-w-5xl mx-auto">
              <div className="flex-1 flex items-center justify-end gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-text-primary">
                    {nameA}
                  </div>
                  <div className="text-xs text-text-secondary">{priceA}</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-surface-elevated shadow-sm border border-border-subtle"></div>
              </div>

              <div className="text-text-secondary font-medium text-sm px-4">
                VS
              </div>

              <div className="flex-1 flex items-center justify-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface border border-border-subtle"></div>
                <div className="text-left">
                  <div className="text-sm font-medium text-text-primary">
                    {nameB}
                  </div>
                  <div className="text-xs text-text-secondary">{priceB}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
