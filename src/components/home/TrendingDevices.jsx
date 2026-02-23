import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Flame, Clock, Trophy } from "lucide-react";
import DeviceCard from "@/components/ui/DeviceCard";

const TABS = [
    { id: "trending", label: "Trending", icon: <Flame size={14} /> },
    { id: "latest", label: "Latest Drops", icon: <Clock size={14} /> },
    { id: "top", label: "Top Rated", icon: <Trophy size={14} /> },
];

export default function TrendingDevices({ products, loading }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("trending");

    // Mock filtering and sorting
    // If you only have a few products, just shuffle or duplicate for demo based on tab
    const displayProducts = [...(products || [])].sort((a, b) => {
        if (activeTab === "latest") {
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
        if (activeTab === "top") {
            return b.slug.localeCompare(a.slug); 
        }
        return 0; // trending (default order)
    });

    return (
        <section className="relative py-20 md:py-28 overflow-hidden bg-bg-main">
            {/* Subtle Gradient Section Divider */}
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-hyper-cyan/20 to-transparent" />
            <div className="absolute top-0 left-1/4 w-1/2 h-px shadow-[0_0_20px_2px_rgba(0,255,255,0.1)] blur-sm" />

            {/* Background Variation */}
            <div className="absolute inset-0 bg-bg-card/20 pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* SECTION HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
                    <div className="max-w-2xl">
                        <motion.h3 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-3xl md:text-5xl font-semibold tracking-tight text-text-primary mb-3"
                        >
                            Trending Devices
                        </motion.h3>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-base text-text-secondary"
                        >
                            See what tech enthusiasts are exploring right now.
                        </motion.p>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto overflow-x-auto pb-4 lg:pb-0"
                    >
                        {/* Premium TABS */}
                        <div className="flex items-center gap-1 p-1 bg-bg-card border border-border-color rounded-xl w-full sm:w-auto shrink-0">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? "bg-text-primary text-bg-main shadow-premium-md"
                                            : "text-text-secondary hover:text-text-primary hover:bg-bg-main"
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* VIEW ALL (Desktop) */}
                        <Link 
                            to="/devices" 
                            className="hidden lg:flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors group whitespace-nowrap shrink-0"
                        >
                            View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* DEVICE GRID */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-96 bg-bg-card rounded-[2.5rem] animate-pulse border border-border-color" />
                        ))}
                    </div>
                ) : (
                    <div className="relative -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-hide overflow-x-auto sm:overflow-visible">
                        <motion.div 
                            layout
                            className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 snap-x snap-mandatory pb-8 sm:pb-0 w-max sm:w-auto items-stretch"
                        >
                            <AnimatePresence mode="popLayout">
                                {displayProducts.slice(0, 4).map((product, i) => (
                                    <motion.div
                                        layout
                                        key={`${product.id}-${activeTab}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                                        className="w-[85vw] sm:w-auto shrink-0 snap-center flex"
                                    >
                                        <div className="w-full flex">
                                            <DeviceCard 
                                                product={product} 
                                                onToggle={() => navigate(`/devices/${product.slug}`)}
                                                score={92 - i * 2} 
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                )}
                
                {/* VIEW ALL (Mobile) */}
                <div className="mt-8 flex justify-center lg:hidden relative z-10 w-full">
                    <Link 
                        to="/devices" 
                        className="flex items-center justify-center gap-2 text-sm font-medium text-text-primary px-6 py-3 rounded-full border border-border-color bg-bg-card hover:bg-bg-main transition-colors group w-full sm:w-auto"
                    >
                        View All Devices
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
            
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                }
            `}</style>
        </section>
    );
}
