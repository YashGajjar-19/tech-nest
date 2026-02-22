import { motion } from "framer-motion";
import { Search, Command } from "lucide-react";
import { useCommand } from "@/context/CommandContext";

export default function CommandSearch() {
    const { toggleCommand } = useCommand();

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl mx-auto mb-8 relative group"
        >
            {/* Ambient Glow */}
            <div className="absolute inset-x-8 -inset-y-2 bg-hyper-cyan/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* The Search Trigger */}
            <button
                onClick={toggleCommand}
                className="w-full relative z-10 flex items-center gap-4 px-6 py-5 md:py-6 rounded-[2rem] bg-bg-card/60 backdrop-blur-2xl border border-border-color hover:border-hyper-cyan/50 hover:bg-bg-card/90 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] transition-all duration-500 ease-spring outline-none text-left"
            >
                <Search className="text-text-secondary group-hover:text-hyper-cyan transition-colors" size={24} strokeWidth={1.5} />
                
                <div className="flex-1 flex items-center">
                    <span className="text-lg md:text-xl text-text-secondary opacity-50 group-hover:opacity-100 font-medium transition-opacity">
                        Search devices, comparisons, news...
                    </span>
                    {/* Blink Cursor Simulation */}
                    <motion.div 
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-[2px] h-6 bg-hyper-cyan ml-2 opacity-0 group-hover:opacity-100"
                    />
                </div>

                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-main border border-border-color">
                    <Command size={14} className="text-text-secondary" />
                    <span className="text-xs font-semibold text-text-secondary tracking-widest">K</span>
                </div>
            </button>
        </motion.div>
    );
}
