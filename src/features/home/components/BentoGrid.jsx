import { motion } from "framer-motion";

/**
 * BENTO CARD: The individual data module
 */
export function BentoCard({ children, icon, title, subtitle, onClick, active, className = "" }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            onClick={onClick}
            className={`relative group overflow-hidden bg-[var(--bg-card)] border-2 rounded-[2.5rem] p-8 transition-all duration-500 ${onClick ? 'cursor-pointer' : ''
                } ${active
                    ? 'border-cyan-500 bg-cyan-500/[0.03] shadow-[0_0_50px_rgba(6,182,212,0.1)]'
                    : 'border-[var(--border-color)] hover:border-[var(--text-secondary)]/20'
                } ${className}`}
        >
            {/* GLOW EFFECT ON HOVER */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between mb-8">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${active ? 'bg-cyan-500 text-black' : 'bg-[var(--bg-main)] text-cyan-500'}`}>
                            {icon}
                        </div>
                        <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                            {title}
                        </span>
                    </div>
                    {subtitle && (
                        <p className="text-[9px] font-mono text-cyan-500/50 uppercase tracking-widest pl-11">
                            {subtitle}
                        </p>
                    )}
                </div>
                {active && (
                    <div className="flex gap-1">
                        <span className="w-1 h-1 bg-cyan-500 rounded-full animate-ping" />
                    </div>
                )}
            </div>

            <div className="relative z-10">
                {children}
            </div>

            {/* BACKGROUND DECO */}
            <div className="absolute -bottom-4 -right-4 text-[var(--text-primary)]/[0.05] font-black italic text-6xl pointer-events-none select-none uppercase">
                {title.split('_')[0]}
            </div>
        </motion.div>
    );
}

/**
 * BENTO GRID: The Layout Wrapper
 */
export default function BentoGrid({ children }) {
    return (
        <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {children}
            </div>
        </section>
    );
}