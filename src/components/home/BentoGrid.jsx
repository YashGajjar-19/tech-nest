import { motion } from "framer-motion";

/**
 * BENTO CARD: 100K Aesthetic Module
 */
export function BentoCard({ children, icon, title, subtitle, onClick, active, className = "" }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            onClick={onClick}
            transition={{ ease: "easeOut", duration: 0.3 }}
            className={`relative group overflow-hidden bg-bg-card/60 backdrop-blur-3xl border rounded-[2rem] p-8 transition-all duration-500 flex flex-col justify-between ${
                onClick ? 'cursor-pointer' : ''
            } ${
                active
                    ? 'border-text-primary/20 shadow-premium-xl'
                    : 'border-border-color hover:border-text-primary/10 hover:shadow-premium-lg'
            } ${className}`}
        >
            {/* CLEAN AMBIENT GLOW ON HOVER */}
            <div className="absolute inset-0 bg-gradient-to-br from-text-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* HEADER AREA */}
            <div className="flex items-start justify-between mb-10 relative z-10">
                <div className="space-y-1.5 flex flex-col">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl transition-colors duration-500 ${active ? 'bg-text-primary text-bg-main' : 'bg-text-primary/5 text-text-primary'}`}>
                            {icon}
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary group-hover:text-text-primary transition-colors">
                            {title.replace('_', ' ')}
                        </span>
                    </div>
                    {subtitle && (
                        <p className="text-[12px] font-medium text-text-secondary/60 pl-11">
                            {subtitle.replace('_', ' ')}
                        </p>
                    )}
                </div>
                {active && (
                    <div className="flex shrink-0">
                        <span className="w-1.5 h-1.5 bg-hyper-cyan rounded-full shadow-premium-glow" />
                    </div>
                )}
            </div>

            {/* CONTENT AREA */}
            <div className="relative z-10 flex-1 flex flex-col">
                {children}
            </div>

            {/* SUBTLE WATERMARK DECO */}
            <div className="absolute -bottom-8 -right-4 text-watermark-text font-semibold text-7xl pointer-events-none select-none tracking-tighter">
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {children}
            </div>
        </section>
    );
}