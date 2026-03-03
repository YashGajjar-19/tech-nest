import { BrainCircuit, Send, Image as ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QueryInterface() {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-bg-primary via-bg-primary to-transparent z-40 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto shadow-2xl rounded-2xl relative border border-border-subtle bg-bg-primary/90 backdrop-blur-3xl overflow-hidden focus-within:border-brand/50 transition-colors">
        
        {/* Generative UI Indicator */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand/50 to-transparent flex" />
        
        <div className="p-3">
          <textarea 
            placeholder="Simulate a decision, explore a category, or ask market logic..."
            className="w-full bg-transparent border-none text-text-primary placeholder:text-text-secondary/50 resize-none outline-none p-3 h-20 text-[15px] custom-scrollbar focus:ring-0"
          />
        </div>

        <div className="flex items-center justify-between p-3 pt-0 border-t border-border-subtle/50 mt-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary hover:text-text-primary rounded-full">
              <ImageIcon className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 rounded-full text-xs gap-1.5 text-brand hidden sm:flex bg-brand/5 hover:bg-brand/10">
              <Sparkles className="w-3.5 h-3.5" />
              Intelligence Mode
            </Button>
            <span className="hidden md:inline-flex text-xs text-text-secondary ml-3 font-mono bg-surface px-2 py-0.5 rounded border border-border-subtle">
              /simulate
            </span>
          </div>

          <div className="flex items-center gap-3">
             <span className="text-xs text-text-secondary font-mono mr-2 hidden sm:inline-block">⌘ + Enter</span>
             <Button size="icon" className="h-9 w-9 rounded-full bg-text-primary text-bg-primary hover:bg-brand transition-colors hover:shadow-brand-glow hover:scale-105 active:scale-95 group">
               <Send className="w-4 h-4 translate-x-[1px] translate-y-[-1px]" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
