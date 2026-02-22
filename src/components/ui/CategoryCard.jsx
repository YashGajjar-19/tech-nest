import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CategoryCard({ title, subtitle, icon, delay = 0 }) {
    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
            className="group relative w-full flex flex-col items-start gap-4 p-6 sm:p-8 rounded-[2rem] bg-bg-card border border-border-color hover:-translate-y-2 hover:border-hyper-cyan/30 hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.15)] transition-all duration-500 ease-spring text-left overflow-hidden outline-none cursor-pointer"
        >
            {/* Ambient Hover Glow */}
            <div className="absolute inset-x-0 -bottom-10 h-32 bg-gradient-to-t from-hyper-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="w-12 h-12 rounded-xl bg-bg-main border border-border-color flex items-center justify-center text-text-secondary group-hover:text-hyper-cyan group-hover:bg-hyper-cyan/10 group-hover:border-hyper-cyan/20 group-hover:scale-110 transition-all duration-500 ease-spring shadow-sm">
                {icon}
            </div>

            <div className="mt-2 w-full flex items-end justify-between">
                <div>
                    <h4 className="text-lg md:text-xl font-semibold tracking-tight text-text-primary mb-1 group-hover:text-hyper-cyan transition-colors">{title}</h4>
                    <p className="text-sm text-text-secondary opacity-80">{subtitle}</p>
                </div>
                
                <div className="w-8 h-8 rounded-full bg-bg-main border border-border-color flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-spring delay-100">
                    <ArrowRight size={14} className="text-hyper-cyan" />
                </div>
            </div>
        </motion.button>
    );
}
