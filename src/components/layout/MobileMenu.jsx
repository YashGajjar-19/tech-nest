import { Link, useLocation } from "react-router-dom";
import { Home, Search, SplitSquareHorizontal, Newspaper, User, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCommand } from "@/context/CommandContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileMenu({ onOpenAuth }) {
    const { user, logout, isAdmin } = useAuth();
    const { toggleCommand } = useCommand();
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const isPathActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* FIXED BOTTOM TABS CONTAINER */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-60 pb-env-safe bg-bg-main/90 backdrop-blur-xl border-t border-border-color shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
                <nav className="flex items-center justify-around px-2 py-3">
                    
                    <Link to="/" className={`flex flex-col items-center gap-1 group w-16 outline-none ${isPathActive('/') ? 'text-hyper-cyan' : 'text-text-secondary hover:text-text-primary'}`}>
                        <div className={`p-1.5 rounded-xl transition-all ${isPathActive('/') ? 'bg-hyper-cyan/10' : 'group-hover:bg-bg-card'}`}>
                            <Home size={22} className={isPathActive('/') ? 'fill-hyper-cyan/20' : ''} />
                        </div>
                        <span className="text-[10px] font-medium transition-colors">Home</span>
                    </Link>
                    
                    <button onClick={toggleCommand} className="flex flex-col items-center gap-1 group w-16 text-text-secondary hover:text-text-primary outline-none">
                        <div className="p-1.5 rounded-xl transition-all group-hover:bg-bg-card">
                            <Search size={22} />
                        </div>
                        <span className="text-[10px] font-medium transition-colors">Search</span>
                    </button>

                    <Link to="/battle" className={`flex flex-col items-center gap-1 group w-16 outline-none ${isPathActive('/battle') ? 'text-hyper-cyan' : 'text-text-secondary hover:text-text-primary'}`}>
                        <div className={`p-1.5 rounded-xl transition-all ${isPathActive('/battle') ? 'bg-hyper-cyan/10' : 'group-hover:bg-bg-card'}`}>
                            <SplitSquareHorizontal size={22} className={isPathActive('/battle') ? 'fill-hyper-cyan/20' : ''} />
                        </div>
                        <span className="text-[10px] font-medium transition-colors">Compare</span>
                    </Link>

                    <Link to="/news" className={`flex flex-col items-center gap-1 group w-16 outline-none ${isPathActive('/news') ? 'text-hyper-cyan' : 'text-text-secondary hover:text-text-primary'}`}>
                        <div className={`p-1.5 rounded-xl transition-all ${isPathActive('/news') ? 'bg-hyper-cyan/10' : 'group-hover:bg-bg-card'}`}>
                            <Newspaper size={22} className={isPathActive('/news') ? 'fill-hyper-cyan/20' : ''} />
                        </div>
                        <span className="text-[10px] font-medium transition-colors">News</span>
                    </Link>

                    <button onClick={() => setDrawerOpen(!drawerOpen)} className={`flex flex-col items-center gap-1 group w-16 outline-none ${drawerOpen ? 'text-hyper-cyan' : 'text-text-secondary hover:text-text-primary'}`}>
                        <div className={`p-1.5 rounded-xl transition-all ${drawerOpen ? 'bg-hyper-cyan/10' : 'group-hover:bg-bg-card'}`}>
                            <User size={22} className={drawerOpen ? 'fill-hyper-cyan/20' : ''} />
                        </div>
                        <span className="text-[10px] font-medium transition-colors">Profile</span>
                    </button>

                </nav>
            </div>

            {/* PROFILE/MENU DRAWER - SLIDE UP FROM BOTTOM */}
            <AnimatePresence>
                {drawerOpen && (
                    <motion.div 
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="md:hidden fixed inset-x-0 bottom-[env(safe-area-inset-bottom,0px)+64px] z-55 bg-bg-card/95 backdrop-blur-3xl border-t border-border-color shadow-premium-2xl rounded-t-3xl overflow-hidden" // 64px roughly space for bottom nav
                    >
                        <div className="px-6 py-6 pb-20 flex flex-col gap-5">
                            <div className="flex justify-center mb-2">
                                <div className="w-12 h-1 bg-border-color rounded-full" />
                            </div>

                            {user ? (
                                <>
                                    <div className="flex items-center gap-4 bg-bg-main p-4 rounded-2xl border border-border-color">
                                        <div className="w-12 h-12 rounded-full bg-linear-to-tr from-hyper-cyan to-blue-500 flex items-center justify-center text-white font-bold text-xl uppercase shadow-glow-cyan">
                                            {user.email?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-text-primary">{user.email?.split('@')[0]}</p>
                                            <p className="text-xs text-text-secondary font-mono bg-bg-card px-2 py-0.5 rounded-md mt-1 inline-block border border-border-color break-all max-w-[180px] overflow-hidden truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 mt-2">
                                        <Link to="/profile" onClick={() => setDrawerOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-bg-main border border-border-color hover:border-hyper-cyan/50 text-text-primary transition-colors">
                                            <User size={20} className="text-text-secondary" />
                                            <span className="font-medium">My Account</span>
                                        </Link>

                                        {isAdmin && (
                                            <Link to="/admin/inventory" onClick={() => setDrawerOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-bg-main border border-border-color hover:border-hyper-cyan/50 text-text-primary transition-colors">
                                                <LayoutDashboard size={20} className="text-hyper-cyan" />
                                                <span className="font-medium">Admin Dashboard</span>
                                            </Link>
                                        )}

                                        <button onClick={async () => { setDrawerOpen(false); await logout(); }} className="flex items-center gap-4 p-4 rounded-2xl bg-bg-main border border-border-color hover:border-red-500/50 text-red-500 transition-colors w-full text-left">
                                            <LogOut size={20} />
                                            <span className="font-medium">Sign Out</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-bg-main border border-border-color rounded-full flex items-center justify-center mx-auto mb-4">
                                        <User size={28} className="text-text-secondary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-text-primary tracking-tight">Not Signed In</h3>
                                    <p className="text-sm text-text-secondary mb-6 mt-1">Sign in to save devices and sync history.</p>
                                    
                                    <button 
                                        onClick={() => { setDrawerOpen(false); onOpenAuth(); }} 
                                        className="w-full py-4 rounded-2xl bg-text-primary text-bg-main font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                                    >
                                        <LogIn size={20} />
                                        Continue with Email
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* INVISIBLE OVERLAY TO CLOSE DRAWER WHEN CLICKING OUTSIDE */}
            <AnimatePresence>
                {drawerOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        transition={{ duration: 0.2 }}
                        onClick={() => setDrawerOpen(false)}
                        className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>
        </>
    );
}
