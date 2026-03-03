import Link from "next/link";
import { Smartphone, Tablet, Cpu, Watch, Laptop } from "lucide-react";

const CATEGORIES = [
  { name: "Phones", icon: Smartphone, href: "/devices/phones" },
  { name: "Tablets", icon: Tablet, href: "/devices/tablets" },
  { name: "Chips", icon: Cpu, href: "/devices/chips" },
  { name: "Wearables", icon: Watch, href: "/devices/wearables" },
  { name: "Laptops", icon: Laptop, href: "/devices/laptops" },
];

export default function CategoryExplorer() {
  return (
    <section className="py-24 px-6 md:py-32 w-full max-w-5xl mx-auto border-t border-border-subtle bg-bg-primary">
      <div className="flex flex-col gap-16 items-center w-full">
        
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary/90 text-center">
          Explore by Category
        </h2>
        
        <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-6 md:gap-12 w-full">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                key={i}
                href={cat.href}
                className="group flex flex-col items-center gap-4 transition-all duration-300 ease-calm hover:drop-shadow-sm"
              >
                <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-3xl bg-text-primary/5 border border-border-subtle transition-all duration-300 group-hover:bg-text-primary/5 group-hover:border-border-subtle shadow-[0_0_20px_rgba(255,255,255,0.01)]">
                  <Icon className="h-8 w-8 md:h-10 md:w-10 text-text-primary/40 transition-colors group-hover:text-text-secondary" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium tracking-wide text-text-primary/60 group-hover:text-text-secondary">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
