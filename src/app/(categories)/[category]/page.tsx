import { Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { DecisionCard } from "@/features/devices/device-card";

export default function CategoryPage({ params }: { params: { category: string } }) {
  const categoryName = (params?.category || "phones").toUpperCase();
  
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary px-6 pt-[20vh] pb-24 w-full max-w-7xl mx-auto">
      {/* Category Header (Premium Typography Hierarchy) */}
      <div className="mb-16 border-b border-border-subtle pb-12 flex flex-col md:flex-row md:items-end md:justify-between animate-in fade-in slide-in-from-top-4 duration-700">
         <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-none">
               {categoryName}
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary font-light">
               Compare the latest models, sort by processing power, or let AI find your perfect match.
            </p>
         </div>

         {/* Utilitarian sort area floating right on desktop */}
         <div className="flex items-center space-x-3 w-full md:w-auto mt-8 md:mt-0">
            <button className="flex items-center text-sm font-semibold border border-border-subtle bg-surface px-6 py-3 rounded-full hover:border-accent transition flex-1 justify-center shadow-sm">
               <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
            </button>
            <button className="flex items-center text-sm font-semibold border border-border-subtle bg-surface px-6 py-3 rounded-full hover:border-accent transition flex-1 justify-center shadow-sm">
               <ArrowUpDown className="w-4 h-4 mr-2" /> Sort
            </button>
         </div>
      </div>

      {/* Utilities / Filter Chips with larger touch targets and minimal borders */}
      <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide mb-12">
         <button className="whitespace-nowrap bg-text-primary text-bg-primary font-medium px-6 py-2 rounded-full text-sm shadow-md transition-transform active:scale-95">All Models</button>
         <button className="whitespace-nowrap bg-surface border border-border-subtle hover:border-text-secondary text-text-secondary hover:text-text-primary font-medium px-6 py-2 rounded-full text-sm transition">Flagships</button>
         <button className="whitespace-nowrap bg-surface border border-border-subtle hover:border-text-secondary text-text-secondary hover:text-text-primary font-medium px-6 py-2 rounded-full text-sm transition">Budget Picks</button>
         <button className="whitespace-nowrap bg-surface border border-border-subtle hover:border-text-secondary text-text-secondary hover:text-text-primary font-medium px-6 py-2 rounded-full text-sm transition">Long Battery</button>
      </div>

      {/* Decision Card Grid (Premium Grid alignment mapping) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
         {/* Mapping mock instances over the DecisionCard design system prop requirement */}
         {[
            { id: "pixel-9-pro", name: "Pixel 9 Pro", b: "Google", s: 89, p: "$999", h: ["Industry-leading Stills", "Clean Android Build", "Native Gemini Nanotensor"] },
            { id: "iphone-16-pro", name: "iPhone 16 Pro", b: "Apple", s: 92, p: "$999", h: ["A18 Pro Efficiency", "Grade 5 Titanium", "Unmatched Ecosystem Apps"] },
            { id: "s24-ultra", name: "Galaxy S24 Ultra", b: "Samsung", s: 91, p: "$1299", h: ["Anti-reflective Display", "Integrated S-Pen", "Periscope Telephoto"] },
            { id: "nothing-phone-2a", name: "Nothing 2a", b: "Nothing", s: 78, p: "$349", h: ["Glyph Interface", "Incredible Value", "Clean OS"] },
            { id: "oneplus-12", name: "OnePlus 12", b: "OnePlus", s: 87, p: "$799", h: ["Insane Charging", "Bright Display", "Smooth OxygenOS"] },
            { id: "zenfone-11", name: "Zenfone 11 Ultra", b: "ASUS", s: 82, p: "$899", h: ["Incredible Battery", "Headphone Jack", "Gimbal Camera"] },
            { id: "xperia-1-vi", name: "Xperia 1 VI", b: "Sony", s: 80, p: "$1199", h: ["Physical Shutter Button", "MicroSD Slot", "Creator Orientated"] },
            { id: "moto-razr-50", name: "Razr+ 2024", b: "Motorola", s: 84, p: "$999", h: ["Massive Cover Screen", "Soft Vegan Leather", "Fun Form Factor"] }
         ].map((device, i) => (
            <DecisionCard 
               key={device.id}
               id={device.id}
               name={device.name}
               brand={device.b}
               score={device.s}
               price={device.p}
               highlights={device.h}
               href={`/device/${device.id}`}
               className={`animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-[${(i % 4) * 100}ms]`}
            />
         ))}
      </div>
    </main>
  );
}
