import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

export default function NewsTicker({ news = [] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (news.length === 0) return;
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % news.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [news]);

    if (!news.length) return null;

    return (
        <div className="relative w-full bg-[var(--bg-card)] border-b border-[var(--border-color)] overflow-hidden">
            {/* 1. TOP MARQUEE (CONTINUOUS RUNNING TEXT) */}
            <div className="bg-cyan-500 py-1 flex overflow-hidden select-none border-b border-black/10">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="flex whitespace-nowrap gap-10 items-center"
                >
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <span className="text-[10px] font-black italic text-black uppercase tracking-widest">
                                Breaking_News // Tech_Nest_Intelligence_Protocol //
                                System_Update_Live
                            </span>
                            <Zap size={10} fill="black" stroke="none" />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* 2. MAIN LARGE NEWS DISPLAY */}
            <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 flex flex-col md:flex-row md:items-center gap-8">
                {/* BIG TAG */}
                <div className="flex-shrink-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={news[index].tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="px-6 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-full inline-block"
                        >
                            <span className="text-cyan-500 font-mono text-xs font-black tracking-[0.3em] uppercase">
                                {news[index].tag}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* LARGE HEADLINE */}
                <div className="flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -40, opacity: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tighter uppercase leading-[0.9] text-[var(--text-primary)]">
                                {news[index].title}
                            </h2>
                            <div className="flex items-center gap-4 mt-6">
                                <div className="h-px w-12 bg-cyan-500/50" />
                                <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.4em]">
                                    Timestamp: {news[index].time}_AGO // ID: 00{news[index].id}
                                </span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* NAVIGATION DOTS */}
                <div className="flex md:flex-col gap-2">
                    {news.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 transition-all duration-500 rounded-full ${i === index
                                    ? "w-12 md:w-1 md:h-12 bg-cyan-500"
                                    : "w-2 md:w-1 md:h-2 bg-[var(--border-color)]"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* BACKGROUND DECORATION */}
            <div className="absolute -right-20 -bottom-20 text-[200px] font-black italic text-[var(--text-primary)]/[0.05] select-none pointer-events-none uppercase">
                NEWS
            </div>
        </div>
    );
}
