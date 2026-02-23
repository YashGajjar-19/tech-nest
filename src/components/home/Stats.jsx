import { motion } from "framer-motion";
import { Smartphone, Newspaper, Users, Zap } from "lucide-react";
import StatCard from "@/components/ui/StatCard";

const STATS_DATA = [
    { id: 1, icon: Smartphone, value: 5000, suffix: "+", label: "Devices Indexed" },
    { id: 2, icon: Newspaper, value: 300, suffix: "+", label: "Articles Published" },
    { id: 3, icon: Users, value: 10000, suffix: "+", label: "Monthly Visitors" },
    { id: 4, icon: Zap, value: 2500, suffix: "+", label: "Comparisons Run" }
];

export default function Stats() {
    return (
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-bg-main border-y border-border-color">
            {/* Elegant background effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-hyper-cyan/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] opacity-20" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                
                <div className="flex flex-col items-center text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-hyper-cyan/10 border border-hyper-cyan/20 text-hyper-cyan text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                    >
                        Network_Statistics
                    </motion.div>

                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-text-primary leading-[1.05]"
                    >
                        Built for <br className="sm:hidden" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-hyper-cyan to-text-primary/70">The Enthusiast</span>
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-base text-text-secondary mt-6 max-w-xl mx-auto leading-relaxed"
                    >
                        Tech Nest is evolving into the ultimate neural network for hardware discovery. Join thousands of users optimizing their digital lives.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {STATS_DATA.map((stat, index) => (
                        <StatCard 
                            key={stat.id}
                            icon={stat.icon}
                            value={stat.value}
                            suffix={stat.suffix}
                            label={stat.label}
                            delay={index * 0.15}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
