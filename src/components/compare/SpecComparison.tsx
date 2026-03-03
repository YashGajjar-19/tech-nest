"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Filter } from "lucide-react";

export default function SpecComparison() {
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "processor",
  );

  const specCategories = [
    {
      id: "processor",
      title: "Processor & Memory",
      specs: [
        {
          name: "Chipset",
          iphone: "A18 Pro (3nm)",
          galaxy: "Snapdragon 8 Gen 3 for Galaxy (4nm)",
          differs: true,
        },
        { name: "RAM", iphone: "8GB", galaxy: "12GB", differs: true },
        {
          name: "Storage Options",
          iphone: "256GB, 512GB, 1TB",
          galaxy: "256GB, 512GB, 1TB",
          differs: false,
        },
      ],
    },
    {
      id: "display",
      title: "Display Technology",
      specs: [
        {
          name: "Size",
          iphone: "6.9 inches",
          galaxy: "6.8 inches",
          differs: true,
        },
        {
          name: "Panel Type",
          iphone: "Super Retina XDR OLED",
          galaxy: "Dynamic AMOLED 2X",
          differs: true,
        },
        {
          name: "Refresh Rate",
          iphone: "1-120Hz (ProMotion)",
          galaxy: "1-120Hz",
          differs: false,
        },
        {
          name: "Peak Brightness",
          iphone: "2000 nits",
          galaxy: "2600 nits",
          differs: true,
        },
      ],
    },
    {
      id: "cameras",
      title: "Camera System",
      specs: [
        {
          name: "Main Sensor",
          iphone: "48MP f/1.78",
          galaxy: "200MP f/1.7",
          differs: true,
        },
        {
          name: "Ultrawide",
          iphone: "48MP f/2.2",
          galaxy: "12MP f/2.2",
          differs: true,
        },
        {
          name: "Telephoto",
          iphone: "12MP (5x Optical)",
          galaxy: "50MP (5x Optical) + 10MP (3x Optical)",
          differs: true,
        },
      ],
    },
    {
      id: "battery",
      title: "Battery & Charging",
      specs: [
        {
          name: "Capacity",
          iphone: "4676 mAh",
          galaxy: "5000 mAh",
          differs: true,
        },
        {
          name: "Wired Charging",
          iphone: "~27W",
          galaxy: "45W",
          differs: true,
        },
        {
          name: "Wireless Charging",
          iphone: "15W (MagSafe)",
          galaxy: "15W",
          differs: false,
        },
      ],
    },
  ];

  return (
    <section className="w-full px-6 lg:px-12 py-24 flex justify-center border-t border-border-subtle bg-bg-primary">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-medium tracking-tight text-text-primary mb-2">
              Technical Specifications
            </h2>
            <p className="text-text-secondary">
              The raw numbers behind the experience.
            </p>
          </div>

          <button
            onClick={() => setShowDifferencesOnly(!showDifferencesOnly)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-subtle bg-surface text-sm font-medium text-text-primary hover:text-text-secondary hover:border-border-subtle hover:bg-surface transition-all"
          >
            <Filter className="w-4 h-4" />
            <span>
              {showDifferencesOnly ? "Show All Specs" : "Highlight Differences"}
            </span>
          </button>
        </div>

        <div className="rounded-3xl border border-border-subtle overflow-hidden bg-bg-primary">
          <div className="grid grid-cols-12 px-6 py-4 border-b border-border-subtle bg-surface text-xs font-semibold uppercase tracking-wider text-text-secondary">
            <div className="col-span-4">Specification</div>
            <div className="col-span-4">iPhone 16 Pro Max</div>
            <div className="col-span-4">Galaxy S24 Ultra</div>
          </div>

          <div className="divide-y divide-border-subtle">
            {specCategories.map((category) => {
              const visibleSpecs = showDifferencesOnly
                ? category.specs.filter((s) => s.differs)
                : category.specs;

              if (visibleSpecs.length === 0) return null;

              const isExpanded = expandedSection === category.id;

              return (
                <div key={category.id} className="flex flex-col">
                  {/* Category Header */}
                  <button
                    onClick={() =>
                      setExpandedSection(isExpanded ? null : category.id)
                    }
                    className="flex items-center justify-between px-6 py-5 hover:bg-surface transition-colors text-left"
                  >
                    <span className="font-medium text-text-primary text-lg">
                      {category.title}
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="text-text-secondary"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>

                  {/* Specs List */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="divide-y divide-border-subtle pb-4">
                          {visibleSpecs.map((spec, i) => (
                            <div
                              key={i}
                              className="grid grid-cols-12 px-6 py-4 items-center gap-4 hover:bg-surface"
                            >
                              <div className="col-span-12 md:col-span-4 text-sm font-medium text-text-secondary">
                                {spec.name}
                              </div>
                              <div className="col-span-6 md:col-span-4 text-sm text-text-primary">
                                {spec.iphone}
                              </div>
                              <div className="col-span-6 md:col-span-4 text-sm text-text-primary">
                                {spec.galaxy}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
