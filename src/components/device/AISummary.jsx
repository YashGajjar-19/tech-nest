import { Sparkles } from "lucide-react";

export default function AISummary({ summary }) {
    if (!summary) return null;

    return (
        <section className="mb-24 relative">
            <div className="absolute inset-0 bg-hyper-cyan/5 rounded-[2.5rem] blur-2xl -z-10"></div>
            
            <div className="bg-bg-card/80 backdrop-blur-xl border border-hyper-cyan/20 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-hyper-cyan/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-hyper-cyan text-bg-main p-2 rounded-xl shadow-premium-glow">
                        <Sparkles size={20} className="animate-pulse" />
                    </div>
                    <h2 className="text-xl font-bold uppercase tracking-widest text-text-primary">Tech Nest AI Summary</h2>
                </div>
                
                <p className="font-mono text-lg md:text-xl leading-relaxed text-text-secondary">
                    {summary}
                </p>
            </div>
        </section>
    );
}
