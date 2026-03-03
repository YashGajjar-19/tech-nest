import { Sparkles, MessageCircleQuestion } from "lucide-react";

export default function AIInsightSection() {
  const suggestedQuestions = [
    "How does the battery perform during active gaming?",
    "Can it record professional grade audio without an external mic?",
    "Is the jump from 15 Pro noticeable for daily tasks?",
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-16 border-t bg-background">
      <div className="flex flex-col relative overflow-hidden max-w-4xl mx-auto border-l border-text-primary/20 pl-8">
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <Sparkles className="w-5 h-5 text-text-primary" />
          <h2 className="text-xs uppercase tracking-widest font-bold text-text-secondary">
            AI Analysts Briefing
          </h2>
        </div>

        <div className="relative z-10 text-base leading-relaxed text-text-primary/80 font-medium mb-10 max-w-3xl">
          <span className="text-text-secondary font-normal mb-4 block">Based on 14,000+ synthesized points of data from YouTube reviewers, written publications, and real-world forum usage over the last 30 days:</span>
          
          <span className="text-text-primary">
            "The A18 Pro genuinely bridges the gap between console gaming and everyday mobile usage. However, most testers universally agree the 'Camera Control' button feels misplaced algorithmically, requiring a steep learning curve. If you shoot 4K 120fps, it's a monumental upgrade. If you just send emails and take casual photos, <span className="bg-text-primary/5 font-semibold px-1">it functions exactly like the iPhone 15.</span>"
          </span>
        </div>

        <div className="flex flex-col gap-6 relative z-10 pt-8 border-t border-border-subtle max-w-2xl">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
            Further Investigation
          </h3>
          
          <div className="flex flex-col gap-2">
            {suggestedQuestions.map((q, idx) => (
              <button 
                key={idx}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface border border-border-subtle text-left hover:border-text-primary/20 hover:bg-surface-elevated transition-colors group"
              >
                <span className="text-text-primary/80 font-medium text-sm">
                  {q}
                </span>
                <MessageCircleQuestion className="w-4 h-4 text-text-secondary group-hover:text-text-primary transition-colors" />
              </button>
            ))}
          </div>
          
          <div className="relative mt-2">
            <input 
              type="text" 
              placeholder="Query the Tech Nest Engine..." 
              className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-3 text-sm placeholder:text-text-primary/20 text-text-primary ring-offset-bg-primary outline-none focus-visible:ring-1 focus-visible:ring-text-primary/20 focus-visible:border-text-primary transition-all font-medium h-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
