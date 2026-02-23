import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    Database,
    Home,
    LogOut,
    Activity,
    ShieldCheck,
    Settings,
    ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

import Logo from "@/components/ui/Logo";

export default function AdminLayout() {
    const { logout } = useAuth();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const navItems = [
        {
            path: "/admin/inventory",
            icon: <Database size={18} />,
            label: "Inventory Logs",
        },
        {
            path: "/admin/devices", // The new daily workspace
            icon: <LayoutDashboard size={18} />,
            label: "Device Manager",
        },
        {
            path: "/admin/analytics",
            icon: <Activity size={18} />,
            label: "Traffic Data",
        },
    ];

    return (
        <div className="flex h-screen bg-bg-main text-text-primary font-sans overflow-hidden transition-colors duration-500">

            {/* 1. SIDEBAR (Fixed Left) */}
            <aside className="w-[280px] h-full bg-bg-card border-r border-border-color flex flex-col relative z-50 shadow-premium-sm">

                {/* BRANDING */}
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-2 mb-6 group cursor-pointer">
                        <div className="relative flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-hyper-cyan shadow-[0_0_10px_var(--accent-glow)]" />
                        </div>
                        <span className="text-xs font-semibold text-text-secondary tracking-wide uppercase">
                            Control Center <span className="opacity-50">v2</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Logo className="text-text-primary" />
                        <span className="font-semibold tracking-tight text-xl text-text-primary">Tech Nest</span>
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className="flex-1 px-4 space-y-1 mt-6">
                    <p className="px-4 text-xs font-semibold text-text-secondary/60 uppercase tracking-wider mb-3">
                        Menu
                    </p>

                    {navItems.map((item) => {
                        const active = pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <motion.div
                                    className={`
                                        relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                        ${active
                                            ? "bg-text-primary/5 text-text-primary font-medium"
                                            : "text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-primary"
                                        }
                                    `}
                                >
                                    {/* Active Indicator Bar */}
                                    {active && (
                                        <motion.div
                                            layoutId="active_indicator"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-hyper-cyan rounded-r-full"
                                        />
                                    )}

                                    <span className={`relative z-10 ${active ? 'text-hyper-cyan' : ''}`}>{item.icon}</span>
                                    <span className="relative z-10 text-sm">
                                        {item.label}
                                    </span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* SYSTEM FOOTER */}
                <div className="p-6 border-t border-border-color bg-bg-card">
                    <div className="space-y-2">
                        <Link
                            to="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-primary transition-all group"
                        >
                            <Home size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                            <span className="text-sm font-medium">Return to App</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-medium"
                        >
                            <LogOut size={16} />
                            <span className="text-sm">
                                Sign Out
                            </span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* 2. MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col relative h-full overflow-hidden bg-bg-main">

                {/* TOP BAR */}
                <header className="h-20 px-8 border-b border-border-color bg-bg-card/60 backdrop-blur-xl flex items-center justify-between sticky top-0 z-40">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-text-secondary">
                            <span className="text-sm font-medium">Dashboard</span>
                            <ChevronRight size={14} className="opacity-50" />
                            <span className="text-sm font-medium text-text-primary">
                                {navItems.find(i => i.path === pathname)?.label || "Overview"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-text-primary/5 border border-border-color">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <span className="text-xs font-medium text-text-secondary">
                                Secure Session
                            </span>
                        </div>

                        {/* Admin Avatar */}
                        <div className="w-9 h-9 rounded-full bg-bg-main border border-border-color flex items-center justify-center text-text-primary font-bold shadow-premium-sm">
                            A
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE VIEWPORT */}
                <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}