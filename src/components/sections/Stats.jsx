import { motion } from "framer-motion";
import StatCard from "@/components/ui/StatCard";

const STATS_DATA = [
    { id: 1, icon: "📱", value: 5000, suffix: "+", label: "Devices Indexed" },
    { id: 2, icon: "📰", value: 300, suffix: "+", label: "Articles Published" },
    { id: 3, icon: "⚡", value: 10000, suffix: "+", label: "Monthly Visitors" },
    { id: 4, icon: "🔍", value: 2500, suffix: "+", label: "Comparisons Run" }
];

export default function Stats() {
    return (
        <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-bg-main border-y border-white/5">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-hyper-cyan/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white">
                        Built for <span className="text-transparent bg-clip-text bg-linear-to-r from-hyper-cyan to-white">Tech Enthusiasts</span>
                    </h2>
                    <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
                        Tech Nest is growing into a serious platform. Join thousands of users discovering, comparing, and discussing the latest tech.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
