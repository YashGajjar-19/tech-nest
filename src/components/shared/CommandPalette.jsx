import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Smartphone, X, ArrowRight, Command } from "lucide-react";
import { getProducts } from "@/services/apiProducts";
import { useCommand } from "@/context/CommandContext";

export default function CommandPalette() {
    const { isOpen, setIsOpen, navigateTo } = useCommand();
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);

    // Fetch list when opened (Optimization: only fetch once or when opened)
    useEffect(() => {
        if (isOpen && products.length === 0) {
            getProducts().then(setProducts);
        }
    }, [isOpen]);

    // Handle Escape Key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, setIsOpen]);

    // Filter Logic
    useEffect(() => {
        if (!query) {
            setFiltered([]);
            return;
        }
        const lower = query.toLowerCase();
        const results = products.filter(p =>
            p.model_name.toLowerCase().includes(lower) ||
            p.brands.name.toLowerCase().includes(lower)
        );
        setFiltered(results.slice(0, 5)); // Limit to top 5
    }, [query, products]);

    // Handle Backdrop Click
    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    onClick={handleBackdrop}
                    className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl rounded-2xl overflow-hidden flex flex-col"
                    >
                        {/* SEARCH INPUT */}
                        <div className="flex items-center gap-4 px-6 py-4 border-b border-[var(--border-color)]">
                            <Search className="text-[var(--text-secondary)]" size={20} />
                            <input
                                autoFocus
                                placeholder="Search database... (e.g., 'Pixel 9')"
                                className="flex-1 bg-transparent text-lg font-mono outline-none placeholder:opacity-40 text-[var(--text-primary)]"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-[var(--bg-main)] rounded-md transition-colors">
                                <span className="text-[10px] font-mono border border-[var(--border-color)] px-2 py-1 rounded text-[var(--text-secondary)]">ESC</span>
                            </button>
                        </div>

                        {/* RESULTS LIST */}
                        <div className="max-h-[300px] overflow-y-auto p-2">
                            {query === "" && (
                                <div className="py-12 text-center opacity-40">
                                    <Command size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-xs font-mono uppercase tracking-widest">Type to search Registry</p>
                                </div>
                            )}

                            {query !== "" && filtered.length === 0 && (
                                <div className="py-8 text-center text-xs font-mono text-red-500 uppercase tracking-widest">
                                    NO_MATCHES_FOUND
                                </div>
                            )}

                            {filtered.map((product, i) => (
                                <button
                                    key={product.id}
                                    onClick={() => navigateTo(`/devices/${product.slug}`)}
                                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-500/20 border border-transparent transition-all group text-left"
                                >
                                    <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center">
                                        <img src={product.image_url} className="h-full object-contain" />
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-[var(--text-primary)] group-hover:text-cyan-500">{product.model_name}</h4>
                                        <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">{product.brands.name}</p>
                                    </div>

                                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-cyan-500" />
                                </button>
                            ))}
                        </div>

                        {/* FOOTER */}
                        <div className="px-4 py-2 bg-[var(--bg-main)] border-t border-[var(--border-color)] flex justify-between items-center">
                            <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Tech_Nest_Search v1.0</span>
                            <div className="flex gap-2 text-[9px] font-mono opacity-40">
                                <span>↑↓ Navigate</span>
                                <span>↵ Select</span>
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}