import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Edit, Search, RefreshCw, Terminal, Box, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProducts, deleteDevice } from "@/services/apiProducts";
import toast from "react-hot-toast";
import { ChevronDown } from "lucide-react";

export default function Inventory() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [visibleCount, setVisibleCount] = useState(6);

    // 1. Fetch Real Data
    const fetchInventory = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            toast.error("CONNECTION_REFUSED");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchInventory(); }, []);

    // 2. Delete Handler
    const handleDelete = async (id) => {
        if (!window.confirm("CONFIRM DELETION? This cannot be undone.")) return;
        try {
            await deleteDevice(id);
            setProducts(prev => prev.filter(p => p.id !== id));
            toast.success("UNIT_REMOVED_FROM_REGISTRY");
        } catch (error) {
            toast.error("DELETION_FAILED");
        }
    };

    // 3. Filter Logic
    const filteredProducts = products.filter(p =>
        p.model_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brands?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleProducts = filteredProducts.slice(0, visibleCount);

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] p-8 font-mono transition-colors duration-500">

            {/* HEADER */}
            <div className="border-b border-[var(--border-color)] pb-8 mb-8 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 text-cyan-500 mb-2">
                        <Terminal size={14} />
                        <span className="text-[10px] tracking-[0.3em] uppercase">Status: Secure_Connection</span>
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                        Hardware_Registry <span className="opacity-20">v.5.0</span>
                    </h1>
                </div>

                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                        <input
                            type="text"
                            placeholder="FILTER_UNITS..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[var(--bg-card)] border border-[var(--border-color)] py-3 pl-10 pr-4 text-[10px] tracking-widest outline-none focus:border-cyan-500/50 transition-all w-64 uppercase rounded-xl"
                        />
                    </div>
                    <button onClick={fetchInventory} className="border border-[var(--border-color)] px-4 rounded-xl hover:bg-cyan-500 hover:text-white transition-all">
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* DATA GRID */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
                {/* TABLE HEADER */}
                <div className="grid grid-cols-12 bg-neutral-100 dark:bg-white/5 text-[9px] uppercase tracking-[0.2em] font-bold opacity-60">
                    <div className="col-span-1 p-4 text-center">ID</div>
                    <div className="col-span-5 p-4">Device_Identity</div>
                    <div className="col-span-3 p-4 text-center">Launch_Price</div>
                    <div className="col-span-3 p-4 text-center">Operations</div>
                </div>

                <AnimatePresence mode="popLayout">
                    {visibleProducts.map((p, idx) => (
                        <motion.div
                            key={p.id}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="grid grid-cols-12 border-t border-[var(--border-color)] hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors group items-center"
                        >
                            <div className="col-span-1 p-4 text-center text-[10px] opacity-40 font-mono">
                                {(idx + 1).toString().padStart(2, '0')}
                            </div>

                            <div className="col-span-5 p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white dark:bg-black border border-[var(--border-color)] flex items-center justify-center p-1">
                                    <img src={p.image_url} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-tight">{p.model_name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {p.brands?.logo_url && <img src={p.brands.logo_url} className="h-3 w-auto opacity-50" />}
                                        <p className="text-[9px] opacity-50 uppercase tracking-widest">{p.brands?.name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-3 p-4 text-center font-bold text-cyan-600 dark:text-cyan-400">
                                {/* Shows price if variant data exists, otherwise '---' */}
                                {p.device_variants?.[0]?.price_launch_usd ? `$${p.device_variants[0].price_launch_usd}` : "---"}
                            </div>

                            <div className="col-span-3 p-4 flex justify-center gap-2">
                                <Link to={`/admin/edit-product/${p.id}`} className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors">
                                    <Edit size={14} className="opacity-50" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredProducts.length === 0 && !loading && (
                    <div className="p-12 text-center text-xs opacity-40 uppercase tracking-widest">No Units Found in Registry</div>
                )}
            </div>

            {/* LOAD MORE BUTTON */}
            {visibleCount < filteredProducts.length && (
                <div className="flex justify-center mt-8">
                    <button 
                        onClick={() => setVisibleCount(prev => prev + 6)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest hover:border-cyan-500 hover:text-cyan-500 transition-all"
                    >
                        Show_More_Devices <ChevronDown size={12} />
                    </button>
                </div>
            )}

            {/* FOOTER STATS */}
            <div className="mt-8 flex justify-between items-center text-[9px] opacity-40 uppercase tracking-[0.4em]">
                <div className="flex gap-6">
                    <span className="flex items-center gap-2"><Shield size={10} /> Admin_Layer_Active</span>
                    <span className="flex items-center gap-2"><Box size={10} /> Total_Units: {products.length}</span>
                </div>
            </div>
        </div>
    );
}