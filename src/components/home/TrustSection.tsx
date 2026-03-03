import { ShieldCheck, Database, Lightbulb } from "lucide-react";

export default function TrustSection() {
  return (
    <section className="py-24 px-6 md:py-32 w-full max-w-5xl mx-auto border-t border-border-subtle">
      <div className="flex flex-col gap-12 md:gap-24 items-center">
        
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-text-primary/90">
            Intelligence built on integrity.
          </h2>
          <p className="mt-6 text-[17px] text-text-primary/40 leading-relaxed font-medium">
            We don't scrape noise. Every spec, score, and recommendation on Tech Nest 
            is structured manually and verified against manufacturer data.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8 w-full">
          
          <div className="flex flex-col gap-4 items-center text-center">
             <div className="w-14 h-14 rounded-2xl bg-text-primary/5 border border-border-subtle flex items-center justify-center mb-2">
                <ShieldCheck className="w-6 h-6 text-blue-400" strokeWidth={1.5} />
             </div>
             <h3 className="text-lg font-semibold text-text-primary/90">Data Verified</h3>
             <p className="text-sm text-text-primary/50 leading-relaxed max-w-[250px]">
               No crowdsourced errors or outdated spec sheets. We audit every detail to ensure absolute accuracy.
             </p>
          </div>

          <div className="flex flex-col gap-4 items-center text-center">
             <div className="w-14 h-14 rounded-2xl bg-text-primary/5 border border-border-subtle flex items-center justify-center mb-2">
                <Database className="w-6 h-6 text-blue-400" strokeWidth={1.5} />
             </div>
             <h3 className="text-lg font-semibold text-text-primary/90">Specifications Structured</h3>
             <p className="text-sm text-text-primary/50 leading-relaxed max-w-[250px]">
               Apples to apples. Our standardized architecture means you can compare any device to another flawlessly.
             </p>
          </div>

          <div className="flex flex-col gap-4 items-center text-center">
             <div className="w-14 h-14 rounded-2xl bg-text-primary/5 border border-border-subtle flex items-center justify-center mb-2">
                <Lightbulb className="w-6 h-6 text-blue-400" strokeWidth={1.5} />
             </div>
             <h3 className="text-lg font-semibold text-text-primary/90">Comparisons Intelligent</h3>
             <p className="text-sm text-text-primary/50 leading-relaxed max-w-[250px]">
               Raw specs don't tell the story. Our specialized algorithms translate numbers into real-world meaning.
             </p>
          </div>

        </div>

      </div>
    </section>
  );
}
