import Link from "next/link";
import { fetchDeviceDecision } from "@/lib/api";

export async function DeviceAlternatives({ slug }: { slug: string }) {
  const decision = await fetchDeviceDecision(slug);
  
  const related = decision?.competitors?.map((c: any) => c.competitor_id?.replace('device-', '')) || 
                 ["Galaxy S24 Ultra", "Pixel 9 Pro", "iPhone 15 Pro"];

  // Replace hyphen with space and uppercase
  const formatName = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <section className="px-6 max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-end mb-12 border-b border-border-subtle pb-6">
         <h2 className="text-3xl font-semibold tracking-tight">Compare Alternatives</h2>
         <Link href={`/compare`} className="hidden md:flex text-text-secondary hover:text-text-primary font-medium text-sm transition group">
            View all comparisons <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
         </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {related.slice(0, 3).map((comp: string, idx: number) => {
           // We might get slugs or exact names. Safe format:
           const compSlug = comp.toLowerCase().replace(/ /g, "-");
           const compName = formatName(comp);
           return (
           <Link href={`/compare/${slug}-vs-${compSlug}`} key={idx} className="group flex items-center justify-between p-6 bg-surface border border-border-subtle rounded-3xl hover:border-accent hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
             <div>
               <p className="text-xs font-semibold tracking-wider text-text-secondary uppercase mb-2 group-hover:text-accent transition-colors">Vs</p>
               <h4 className="text-xl font-medium tracking-tight text-text-primary">{compName}</h4>
             </div>
             <div className="w-12 h-12 rounded-full border border-border-subtle flex items-center justify-center bg-bg-primary text-text-secondary group-hover:bg-accent group-hover:text-accent-foreground transition-colors mix-blend-multiply dark:mix-blend-screen">
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
             </div>
           </Link>
        )})}
      </div>
    </section>
  );
}
