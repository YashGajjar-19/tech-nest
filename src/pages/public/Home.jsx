import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swords, Star, Lightbulb, Activity } from "lucide-react";

// Feature Components
import NewsTicker from "@/features/home/components/NewsTicker";
import BentoGrid, { BentoCard } from "@/features/home/components/BentoGrid";
import ProductCard from "@/features/products/components/ProductCard";

import { getProducts } from "@/services/apiProducts";

const MOCK_NEWS = [
    { id: 1, tag: "CORE", title: "Snapdragon 8 Gen 5 Benchmarks Leak", time: "05M" },
    { id: 2, tag: "CELL", title: "iPhone 17 Pro to ditch physical buttons", time: "12M" },
];

export default function Home() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts().then((data) => {
            setProducts(data || []);
            setLoading(false);
        });
    }, []);

    return (
        <div className="space-y-12">
            {/* 1. NEWS TICKER */}
            <NewsTicker news={MOCK_NEWS} />

            {/* 2. BENTO GRID */}
            <BentoGrid>
                <BentoCard icon={<Star size={18} />} title="EXPERT_LOGS" subtitle="Hardware_Analysis">
                    <div className="p-4 text-xs text-[var(--text-secondary)]">Recent reviews module...</div>
                </BentoCard>

                <BentoCard
                    icon={<Swords size={18} />}
                    title="COMBAT_QUEUE"
                    subtitle="Realtime_Compare"
                    onClick={() => navigate('/battle')}
                >
                    <div className="flex flex-col items-center justify-center py-6">
                        <div className="text-6xl font-black italic tracking-tighter">0<span className="text-[var(--text-secondary)]">/2</span></div>
                        <p className="text-[9px] text-cyan-500 mt-2 font-bold uppercase tracking-[0.5em]">WAITING_FOR_UNITS</p>
                    </div>
                </BentoCard>

                <BentoCard icon={<Lightbulb size={18} />} title="FIELD_MANUAL" subtitle="Optimization_Tips">
                    <div className="p-4 text-xs text-[var(--text-secondary)]">Tips module...</div>
                </BentoCard>
            </BentoGrid>

            {/* 3. PRODUCT REGISTRY */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="flex items-center gap-6 mb-10">
                    <div className="flex items-center gap-3">
                        <Activity className="text-cyan-500" size={20} />
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">Hardware_Registry</h3>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-color)] to-transparent" />
                </div>

                {loading ? (
                    <div className="text-center font-mono text-cyan-500 animate-pulse">SYNCING_DATABASE...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onToggle={() => navigate(`/devices/${product.slug}`)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}