"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Smartphone,
  Settings2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const REFINEMENT_CHIPS = [
  "+ Prioritize Battery",
  "+ Drop to $600",
  "+ Only iOS",
  "+ Better Camera",
];

const MOCK_RESULTS = [
  {
    id: "pixel-8-pro",
    name: "Pixel 8 Pro",
    score: 94,
    price: "$999",
    category: "Phones",
    image:
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80",
    whyBuy: [
      "Best-in-class computational photography",
      "7 years of OS updates",
      "Clean software experience",
    ],
    whyAvoid: [
      "Tensor G3 runs warm under load",
      "Slower charging speeds",
      "Battery life is good, not elite",
    ],
    specs: ['6.7" OLED 120Hz', "Tensor G3", "5050mAh", "50MP Main"],
  },
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    score: 92,
    price: "$999",
    category: "Phones",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    whyBuy: [
      "Unmatched ecosystem integration",
      "A17 Pro performance",
      "Titanium build makes it lighter",
    ],
    whyAvoid: [
      "Locked down OS",
      "Very slow charging",
      "Expensive repair costs",
    ],
    specs: ['6.1" OLED 120Hz', "A17 Pro", "3274mAh", "48MP Main"],
  },
  {
    id: "galaxy-s24-ultra",
    name: "Galaxy S24 Ultra",
    score: 89,
    price: "$1299",
    category: "Phones",
    image:
      "https://images.unsplash.com/photo-1707227155452-953e34b998cf?w=800&q=80",
    whyBuy: [
      "Anti-reflective display is game-changing",
      "Built-in S-Pen",
      "Incredible battery life",
    ],
    whyAvoid: [
      "Very heavy and bulky",
      "Samsung UI has a learning curve",
      "High starting price",
    ],
    specs: ['6.8" OLED 120Hz', "Snapdragon 8 Gen 3", "5000mAh", "200MP Main"],
  },
];

export default function SearchSurfaceResults({ query }: { query: string }) {
  const [activeChips, setActiveChips] = useState<string[]>([]);

  const toggleChip = (chip: string) => {
    setActiveChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip],
    );
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Search Command Echo */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-heading font-medium tracking-tight text-text-primary">
          <span className="text-text-secondary">Decision for</span> "
          {query || "Best overall phones"}"
        </h1>
      </div>

      {/* Perplexity-style AI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full bg-surface-elevated border border-border-subtle rounded-2xl p-6 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand/10 transition-colors pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-brand font-medium">
            <Sparkles className="w-5 h-5" />
            <span>Tech Nest Intelligence</span>
          </div>
          <p className="text-lg text-text-primary/90 leading-relaxed font-medium">
            For under $1000, the{" "}
            <strong className="text-text-primary">Pixel 8 Pro</strong> offers
            the best camera architecture and AI features, though the{" "}
            <strong className="text-text-primary">iPhone 15 Pro</strong>{" "}
            provides superior ecosystem longevity and raw performance. Here is
            the optimal breakdown for your needs.
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Settings2 className="w-4 h-4 text-text-secondary mr-1" />
            <span className="text-sm text-text-secondary">
              Refine constraints:
            </span>
            {REFINEMENT_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => toggleChip(chip)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  activeChips.includes(chip)
                    ? "bg-text-primary text-background border-text-primary"
                    : "bg-surface text-text-secondary border-border-subtle hover:border-text-primary/30 hover:text-text-primary"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Ranked Decision Cards */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            Top Ranked Choices
          </h2>
          <span className="text-sm text-text-secondary font-medium uppercase tracking-widest">
            Matched 3 Devices
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_RESULTS.map((device, index) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.15,
                duration: 0.5,
                ease: "easeOut",
              }}
              className={`flex flex-col bg-surface border rounded-2xl overflow-hidden transition-all hover:border-text-primary/20 hover:shadow-lg ${
                index === 0
                  ? "md:col-span-2 md:flex-row border-brand/30 shadow-sm"
                  : "border-border-subtle"
              }`}
            >
              <div
                className={`relative ${index === 0 ? "md:w-2/5" : "w-full"} h-64 md:h-auto bg-text-primary/5`}
              >
                <Image
                  src={device.image}
                  alt={device.name}
                  fill
                  className="object-cover"
                />

                {index === 0 && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-surface/80 backdrop-blur-md rounded-full border border-border-subtle shadow-sm z-10">
                    <Sparkles className="w-3.5 h-3.5 text-brand" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                      Top Choice
                    </span>
                  </div>
                )}

                <div className="absolute top-4 right-4 flex flex-col items-center justify-center w-12 h-12 bg-surface/90 backdrop-blur-md rounded-xl border border-border-subtle shadow-sm z-10">
                  <span className="text-lg font-bold text-text-primary leading-none">
                    {device.score}
                  </span>
                </div>
              </div>

              <div
                className={`flex flex-col p-6 ${index === 0 ? "md:w-3/5" : "w-full"}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs text-text-secondary font-medium tracking-wider uppercase">
                      {device.category}
                    </span>
                    <h3 className="text-2xl font-bold mt-1">{device.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-medium">{device.price}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {device.specs.slice(0, 3).map((spec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs font-medium bg-text-primary/5 rounded-md text-text-secondary"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Tradeoff Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-green-500/90 dark:text-green-400">
                      <CheckCircle2 className="w-4 h-4" /> Why to buy
                    </div>
                    <ul className="flex flex-col gap-1.5 text-sm text-text-secondary">
                      {device.whyBuy.slice(0, 2).map((reason, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-green-500/50 mt-1.5 shrink-0" />
                          <span className="leading-tight">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-red-500/90 dark:text-red-400">
                      <XCircle className="w-4 h-4" /> Why to avoid
                    </div>
                    <ul className="flex flex-col gap-1.5 text-sm text-text-secondary">
                      {device.whyAvoid.slice(0, 2).map((reason, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-red-500/50 mt-1.5 shrink-0" />
                          <span className="leading-tight">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border-subtle flex items-center justify-between">
                  <Link
                    href={`/devices/${device.id}`}
                    className="text-sm font-medium hover:text-brand transition-colors flex items-center gap-1.5"
                  >
                    View full analysis <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/compare?devices=${device.id}`}
                    className="px-4 py-2 text-sm font-medium bg-text-primary text-background rounded-lg hover:bg-text-primary/90 transition-colors"
                  >
                    Add to Compare
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
