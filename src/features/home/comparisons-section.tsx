import Link from "next/link";
import { ChevronRight, Scale } from "lucide-react";

export function ComparisonsSection() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto w-full border-t border-border-subtle border-dashed">
       <div className="mb-12 flex justify-between items-end">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary">Popular Comparisons</h2>
          <Link href="/compare" className="hidden sm:flex items-center text-sm font-semibold tracking-wider uppercase text-text-secondary hover:text-text-primary transition-colors">
             Explore Matrix <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
             { a: "iPhone 15", b: "Pixel 8", sa: 90, sb: 89, v: "iPhone wins on ecosystem, Pixel wins on stills." },
             { a: "Galaxy S24", b: "OnePlus 12", sa: 91, sb: 88, v: "S24 for compact AI, OnePlus for raw battery." },
             { a: "Pixel 8", b: "Nothing 2", sa: 89, sb: 82, v: "Pixel offers computational depth; Nothing focuses on UI design." }
          ].map((comp, i) => (
             <Link href={`/compare/${comp.a.toLowerCase().replace(/ /g, "-")}-vs-${comp.b.toLowerCase().replace(/ /g, "-")}`} key={i} className="group bg-surface border border-border-subtle rounded-3xl p-8 hover:border-text-secondary transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between min-h-[280px]">
                
                {/* Top: Score Bars vs */}
                <div className="flex justify-between items-center mb-6 text-xl font-semibold tracking-tight">
                   <span className="flex flex-col">
                      <span>{comp.a}</span>
                      <span className="text-sm font-bold text-accent mt-1">{comp.sa}</span>
                   </span>
                   <div className="w-10 h-10 bg-bg-secondary rounded-full flex items-center justify-center border border-border-subtle group-hover:rotate-12 transition-transform">
                      <Scale className="w-4 h-4 text-text-secondary" />
                   </div>
                   <span className="flex flex-col items-end">
                      <span>{comp.b}</span>
                      <span className="text-sm font-bold text-text-secondary mt-1">{comp.sb}</span>
                   </span>
                </div>

                {/* Mid: Images Mock */}
                <div className="w-full h-24 bg-linear-to-tr from-bg-secondary to-surface border border-border-subtle rounded-xl flex items-center justify-center mb-6">
                   <span className="text-xs uppercase tracking-widest font-semibold text-text-secondary/50">VS View</span>
                </div>

                {/* Bottom: Quick Verdict block */}
                <div className="bg-bg-secondary px-4 py-3 rounded-xl border border-border-subtle text-sm text-text-secondary font-medium group-hover:text-text-primary group-hover:bg-surface transition-colors">
                   {comp.v}
                </div>
             </Link>
          ))}
       </div>
    </section>
  );
}
