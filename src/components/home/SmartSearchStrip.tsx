"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Link from "next/link";

const POPULAR_SEARCHES = [
  "iPhone 16 Pro",
  "Snapdragon 8 Gen 4",
  "Best camera phones",
  "Under ₹40,000",
];

export default function SmartSearchStrip() {
  return (
    <section className="w-full border-y border-border-subtle bg-bg-primary py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center gap-4 overflow-x-auto px-6 hide-scrollbar md:justify-center">
        <span className="shrink-0 text-sm font-medium text-text-primary/50">
          Popular Searches
        </span>
        <div className="h-4 w-px shrink-0 bg-text-primary/5" />
        <div className="flex items-center gap-3">
          {POPULAR_SEARCHES.map((query, index) => (
            <motion.div
              key={query}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className="group flex shrink-0 items-center gap-2 rounded-full border border-border-subtle bg-text-primary/5 px-4 py-1.5 text-sm text-text-primary/80 transition-colors hover:border-border-subtle hover:bg-text-primary/5"
              >
                <Search className="h-3.5 w-3.5 text-text-primary/40 group-hover:text-text-secondary transition-colors" />
                {query}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
