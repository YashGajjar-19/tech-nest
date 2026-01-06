import { Cpu, Battery, MousePointer2 } from "lucide-react";
import { motion } from "framer-motion";
import { useBattle } from "@/context/BattleContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { addToBattle, removeFromBattle, isInBattle } = useBattle();

    if (!product) return null;

    // Destructure based on your NEW Schema
    const {
        id,
        slug, // Added slug
        model_name,
        image_url,
        brands, // This is an object now: { name: "Samsung", logo_url: "..." }
        ai_summary,
        device_variants
    } = product;

    const isSelected = isInBattle(id);

    // 2. Find the starting price (lowest price among variants)
    const startingPrice = device_variants?.length > 0
        ? Math.min(...device_variants.map(v => v.price_launch_usd))
        : "N/A";

    const handleToggle = (e) => {
        e.preventDefault(); // Prevent clicking the Link if any
        e.stopPropagation();
        if (isSelected) removeFromBattle(id);
        else addToBattle(product);
    };

    const handleNavigate = () => {
        navigate(`/devices/${slug || id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative group bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[3rem] p-6 transition-all duration-500 ${isSelected
                ? 'border-cyan-500 shadow-[0_0_60px_var(--accent-glow)]'
                : 'hover:border-cyan-500/30'
                }`}
        >
            {/* PRICE (Top Left) */}
            <div className="absolute top-8 left-8 z-20 pointer-events-none">
                <span className="text-[var(--text-primary)] font-bold text-lg ">
                    {startingPrice !== "N/A" ? `$${startingPrice}` : ""}
                </span>
            </div>

            {/* BRAND LOGO (Top Right) */}
            <div className="absolute top-8 right-8 z-20 opacity-50 transition-all">
                {brands?.logo_url && <img src={brands.logo_url} alt={brands.name} className="h-6 w-auto" />}
            </div>

            {/* IMAGE AREA */}
            <div
                onClick={handleNavigate}
                className="relative h-48 mb-6 flex items-center justify-center overflow-hidden rounded-2xl bg-white/[0.02] cursor-pointer group-hover:bg-white/[0.05] transition-colors"
            >
                <img
                    src={image_url || "https://via.placeholder.com/300"}
                    alt={model_name}
                    className="h-full object-contain transition-all duration-500 scale-70 group-hover:scale-71"
                />
            </div>

            {/* CONTENT */}
            <div className="mb-6 cursor-pointer" onClick={handleNavigate}>
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-cyan-500">
                        {brands?.name || "GENERIC"}
                    </span>
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-[var(--text-primary)] mb-2">
                    {model_name}
                </h3>
                {/* AI SUMMARY TRUNCATED */}
                <p className="text-[10px] font-mono text-[var(--text-secondary)] line-clamp-2">
                    {ai_summary || "NO_NEURAL_DATA_AVAILABLE..."}
                </p>
            </div>

            {/* ACTION BUTTON */}
            <button
                onClick={handleToggle}
                className={`w-full py-4 rounded-xl font-black text-[10px] tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 active:scale-95 ${isSelected
                    ? 'bg-cyan-500 text-black shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                    : 'bg-[var(--bg-main)] text-[var(--text-primary)]'
                    }`}
            >
                {isSelected ? 'DISENGAGE' : 'SELECT_UNIT'} <MousePointer2 size={12} />
            </button>
        </motion.div>
    );
}