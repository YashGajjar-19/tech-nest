import { motion } from "framer-motion";
import { useCommand } from "@/context/CommandContext";

export default function TrendingSearches() {
    const TRENDS = [
        { label: "iPhone 16 Pro", path: "/devices/iphone-16-pro" },
        { label: "S24 Ultra vs Pixel 9", path: "/battle?d1=s24-ultra&d2=pixel-9" },
        { label: "Best camera phone under ₹50K", path: "/ai" },
        { label: "Snapdragon 8 Gen 4", path: "/news" }
    ];

    const { toggleCommand } = useCommand(); // Using toggle for now, or just navigation if implemented

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-4 mb-16 px-4"
        >
            <div className="flex flex-wrap items-center justify-center gap-3">
                {TRENDS.map((trend, i) => (
                    <button
                        key={i}
                        onClick={toggleCommand}
                        className="px-4 py-2 rounded-full bg-bg-card/50 backdrop-blur-sm border border-border-color text-xs md:text-sm font-medium text-text-secondary hover:text-hyper-cyan hover:border-hyper-cyan/30 hover:bg-hyper-cyan/5 transition-all duration-300"
                    >
                        {trend.label}
                    </button>
                ))}
            </div>
        </motion.div>
    );
}
