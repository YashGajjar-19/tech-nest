"use client";

import type { Metadata } from "next";
import {
  Cpu,
  Camera,
  Battery,
  MonitorSmartphone,
  Wifi,
  Wrench,
  Sparkles,
  Plus,
  ArrowRight,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

/* ──────────────────────────────────────────────────────────────
   PHONE DETAIL PAGE — "Dual-Soul" Design

   Light: Apple "Product Hero" — device on white pedestal
   Dark: Linear "Command Center" — nested panels, accent glows
   
   Features:
   · "Intelligence Bar" (Whisper Lines) for ratings
   · Geist Mono for specs (engineered data feel)
   · Staggered entrance animations
   · Center column layout (1200px)
   ────────────────────────────────────────────────────────────── */

interface PhoneDetail {
  slug: string;
  name: string;
  brand: string;
  releaseYear: number;
  status: string;
  price: string;
  imageUrl: string;
  overallScore: number;
  subScores: {
    camera: number;
    performance: number;
    battery: number;
    display: number;
    value: number;
  };
  specs: {
    display: Record<string, string>;
    performance: Record<string, string>;
    camera: Record<string, string>;
    battery: Record<string, string>;
    connectivity: Record<string, string>;
    build: Record<string, string>;
  };
  news: Array<{
    id: string;
    title: string;
    source: string;
    date: string;
    thumbnail: string;
  }>;
}

const mockPhone: PhoneDetail = {
  slug: "samsung-galaxy-s24-ultra",
  name: "Galaxy S24 Ultra",
  brand: "Samsung",
  releaseYear: 2024,
  status: "Available",
  price: "$1,299",
  imageUrl:
    "https://images.unsplash.com/photo-1706699119630-f9b0f1fae929?auto=format&fit=crop&q=80&w=600&h=800",
  overallScore: 92,
  subScores: {
    camera: 94,
    performance: 98,
    battery: 89,
    display: 96,
    value: 82,
  },
  specs: {
    display: {
      Type: "AMOLED 2X, 120Hz, HDR10+",
      Size: "6.8 inches, 113.5 cm²",
      Resolution: "1440 x 3120 pixels, 19.5:9 ratio",
      Protection: "Corning Gorilla Armor",
    },
    performance: {
      OS: "Android 14, One UI 6.1",
      Chipset: "Snapdragon 8 Gen 3 (4 nm)",
      CPU: "8-core (1x3.39GHz & ...)",
      RAM: "12GB LPDDR5X",
      Storage: "256GB / 512GB / 1TB",
    },
    camera: {
      Main: "200 MP, f/1.7, OIS",
      Telephoto: "50 MP, f/3.4, 5x optical zoom",
      Ultrawide: "12 MP, f/2.2, 120˚",
      Video: "8K@30fps, 4K@120fps",
    },
    battery: {
      Capacity: "5000 mAh",
      Charging: "45W wired, 15W wireless",
    },
    connectivity: {
      WLAN: "Wi-Fi 7, tri-band",
      Bluetooth: "5.3, A2DP, LE",
      USB: "USB Type-C 3.2",
    },
    build: {
      Dimensions: "162.3 x 79 x 8.6 mm",
      Weight: "232 g",
      Frame: "Titanium, glass front & back",
      Resistance: "IP68 dust/water resistant",
    },
  },
  news: [
    {
      id: "1",
      title: "Samsung Galaxy S24 Ultra Review: The AI Phone Era Begins",
      source: "TechRadar",
      date: "Jan 25, 2024",
      thumbnail:
        "https://images.unsplash.com/photo-1610940540024-9b87b7705177?auto=format&fit=crop&q=80&w=400&h=300",
    },
    {
      id: "2",
      title: "Galaxy S24 Ultra Camera Deep Dive: 5x Telephoto Tested",
      source: "The Verge",
      date: "Jan 28, 2024",
      thumbnail:
        "https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&q=80&w=400&h=300",
    },
    {
      id: "3",
      title: "Ultimate Drop Test: Can Titanium Save the S24 Ultra?",
      source: "CNET",
      date: "Feb 2, 2024",
      thumbnail:
        "https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&q=80&w=400&h=300",
    },
    {
      id: "4",
      title: "Battery Showdown: S24 Ultra vs iPhone 15 Pro Max",
      source: "Toms Guide",
      date: "Feb 10, 2024",
      thumbnail:
        "https://images.unsplash.com/photo-1621330396167-85fd4fedf0e3?auto=format&fit=crop&q=80&w=400&h=300",
    },
  ],
};

const specCategoryIcons: Record<string, typeof Cpu> = {
  display: MonitorSmartphone,
  performance: Cpu,
  camera: Camera,
  battery: Battery,
  connectivity: Wifi,
  build: Wrench,
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export default function PhoneDetailPage() {
  const phone = mockPhone;
  const maxScore = Math.max(...Object.values(phone.subScores));

  return (
    <div className="pt-24 pb-32 w-full min-h-screen">
      <div className="center-col flex flex-col space-y-24 md:space-y-32">
        {/* ── 1. Hero Section ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left: Image — Apple product-hero pedestal */}
          <motion.div
            className="lg:col-span-5 order-2 lg:order-1 flex items-center justify-center p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={phone.imageUrl}
              alt={phone.name}
              className="w-full max-w-xs object-contain mix-blend-multiply dark:mix-blend-normal"
            />
          </motion.div>

          {/* Right: Info */}
          <motion.div
            className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.06 },
              },
            }}
          >
            <motion.div variants={fadeUpVariants} className="flex items-center gap-3 mb-6">
              <span className="tn-label inline-flex items-center px-3 py-1 rounded-full border border-[var(--border)]">
                {phone.status}
              </span>
            </motion.div>

            <motion.p variants={fadeUpVariants} className="tn-label mb-4">
              {phone.brand} • {phone.releaseYear}
            </motion.p>

            <motion.h1 variants={fadeUpVariants} className="tn-h1 mb-8">
              {phone.name}
            </motion.h1>

            <motion.div
              variants={fadeUpVariants}
              className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8"
            >
              <span className="tn-h2">{phone.price}</span>
              <button className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-[var(--accent)] text-white shadow-[var(--shadow-accent)] hover:brightness-110 font-medium transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" strokeWidth={1.25} />
                Add to Compare
              </button>
            </motion.div>

            {/* Quick Specs Grid (2×2) */}
            <motion.div
              variants={fadeUpVariants}
              className="grid grid-cols-2 gap-px bg-[var(--border-subtle)] rounded-2xl overflow-hidden border border-[var(--border-subtle)]"
            >
              {[
                {
                  icon: MonitorSmartphone,
                  label: "Display",
                  value: '6.8" AMOLED',
                },
                {
                  icon: Cpu,
                  label: "System",
                  value: "Snapdragon 8 Gen 3",
                },
                {
                  icon: Camera,
                  label: "Camera",
                  value: "200 MP Primary",
                },
                {
                  icon: Battery,
                  label: "Battery",
                  value: "5000 mAh",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[var(--bg-base)] p-6 flex flex-col justify-center group"
                >
                  <item.icon
                    className="w-4 h-4 mb-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-200"
                    strokeWidth={1.25}
                  />
                  <span className="tn-label mb-1">{item.label}</span>
                  <span className="tn-spec font-medium text-[var(--text-primary)]">
                    {item.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── 2. Specifications ── */}
        <motion.section
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          <motion.div
            variants={fadeUpVariants}
            className="flex items-baseline justify-between border-b border-[var(--divider)] pb-6"
          >
            <h2 className="tn-h2">Technical details</h2>
          </motion.div>

          <div className="flex flex-col">
            {Object.entries(phone.specs).map(([category, specs], idx) => {
              const Icon = specCategoryIcons[category] || Wrench;

              return (
                <motion.div
                  key={category}
                  variants={fadeUpVariants}
                  className={`grid grid-cols-1 md:grid-cols-4 py-8 group ${idx !== Object.keys(phone.specs).length - 1 ? "border-b border-[var(--divider)]" : ""}`}
                >
                  <div className="md:col-span-1 flex items-start gap-4 mb-6 md:mb-0 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors duration-200">
                    <Icon className="w-4 h-4 mt-0.5" strokeWidth={1.25} />
                    <h3 className="tn-label">{category}</h3>
                  </div>
                  <div className="md:col-span-3 flex flex-col gap-1">
                    {Object.entries(specs).map(([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-1 sm:grid-cols-3 py-4 border-b border-[var(--border-subtle)] last:border-0 -mx-4 px-4 rounded-xl"
                      >
                        <span className="tn-body-sm text-[var(--text-muted)] font-medium">
                          {key}
                        </span>
                        <span className="tn-spec sm:col-span-2 text-[var(--text-primary)] leading-relaxed">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── 3. AI Insight Summary ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
        >
          <div className="relative p-8 border border-[var(--accent-muted)] rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[var(--accent-subtle)]" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-start md:gap-8">
              <div className="mb-6 md:mb-0 shrink-0">
                <div className="w-10 h-10 rounded-xl border border-[var(--accent-muted)] flex items-center justify-center bg-[var(--accent-subtle)]">
                  <Sparkles
                    className="w-4 h-4 text-[var(--accent)]"
                    strokeWidth={1.25}
                  />
                </div>
              </div>
              <div className="max-w-3xl">
                <h3 className="tn-label mb-6 flex items-center gap-3">
                  AI Insight Summary
                  <span className="px-2 py-1 rounded-full border border-[var(--accent-muted)] text-[var(--accent)] tn-label bg-[var(--accent-subtle)]">
                    Coming Soon
                  </span>
                </h3>
                <p className="tn-body-lg">
                  We are evaluating thousands of reviews, benchmarks, and
                  real-world sentiment for the {phone.name}. Expect a
                  synthesized, unbiased verdict arriving soon.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── 4. Rating Section — "Intelligence Bar" (Whisper Lines) ── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
            <motion.div
              variants={fadeUpVariants}
              className="flex flex-col items-center md:items-start text-center md:text-left shrink-0"
            >
              <span className="tn-label mb-6">Nest Score</span>
              <span className="text-[clamp(3rem,8vw,5rem)] font-semibold tracking-[-0.04em] leading-none text-[var(--text-primary)] font-[family-name:var(--font-geist-sans)]">
                {phone.overallScore}
              </span>
            </motion.div>

            <div className="flex flex-col gap-6 w-full max-w-xl">
              {Object.entries(phone.subScores).map(([key, score]) => {
                const isWinner = score === maxScore;
                return (
                  <motion.div key={key} variants={fadeUpVariants}>
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="text-[14px] capitalize font-medium text-[var(--text-secondary)]">
                        {key}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="tn-spec text-[var(--text-muted)]">
                          {score}
                        </span>
                        {isWinner && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: 0.6,
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                          >
                            <Check
                              className="w-3.5 h-3.5 text-[var(--success)]"
                              strokeWidth={2}
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    {/* "Whisper Line" — 2px bar */}
                    <div className={`tn-bar ${isWinner ? "tn-bar-winner" : ""}`}>
                      <motion.div
                        className="tn-bar-fill"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${score}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.8,
                          delay: 0.2,
                          ease: [0.16, 1, 0.3, 1] as [
                            number,
                            number,
                            number,
                            number,
                          ],
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ── 5. Related News ── */}
        <motion.section
          className="space-y-8 pb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.06 } },
          }}
        >
          <motion.div
            variants={fadeUpVariants}
            className="flex items-baseline justify-between border-b border-[var(--divider)] pb-6"
          >
            <h2 className="tn-h2">Related coverage</h2>
            <a
              href="#"
              className="tn-label hover:text-[var(--accent)] transition-colors flex items-center"
            >
              View all{" "}
              <ArrowRight className="w-3 h-3 ml-2" strokeWidth={1.25} />
            </a>
          </motion.div>

          <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-6 -mx-6 px-6 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {phone.news.map((item) => (
              <motion.a
                key={item.id}
                href="#"
                variants={fadeUpVariants}
                className="w-[300px] sm:w-[380px] shrink-0 snap-start group flex flex-col"
              >
                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden mb-4 bg-[var(--bg-secondary)] relative border border-[var(--border-subtle)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </div>
                <div className="flex flex-col px-1">
                  <div className="flex items-center gap-3 tn-label mb-3">
                    <span>{item.source}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                    <span>{item.date}</span>
                  </div>
                  <h4 className="tn-h4 group-hover:text-[var(--accent)] transition-colors duration-200">
                    {item.title}
                  </h4>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
