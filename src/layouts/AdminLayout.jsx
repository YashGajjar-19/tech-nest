import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    Database,
    Home,
    LogOut,
    Activity,
    ShieldCheck,
    Terminal,
    Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

import Logo from "@/components/shared/Logo";

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
            label: "Inventory_Logs",
        },
        // We will build this next
        {
            path: "/admin/add-product",
            icon: <LayoutDashboard size={18} />,
            label: "Deploy_Unit",
        },
        {
            path: "/admin/analytics",
            icon: <Activity size={18} />,
            label: "Traffic_Data",
        },
    ];

    return (
        <div className="flex h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans overflow-hidden transition-colors duration-500">

            {/* 1. SIDEBAR (Fixed Left) */}
            <aside className="w-[280px] h-full bg-[var(--bg-card)] border-r border-[var(--border-color)] flex flex-col relative z-50">

                {/* BRANDING */}
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6 group cursor-pointer">
                        <div className="relative">
                            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_15px_var(--accent-glow)]" />
                            <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-500 animate-ping opacity-20" />
                        </div>
                        <span className="font-mono text-[9px] uppercase tracking-[0.3em] font-bold text-cyan-500">
                            Admin_OS v2.0
                        </span>
                    </div>
                    <Logo className="text-[var(--text-primary)]" />
                </div>

                {/* NAVIGATION */}
                <nav className="flex-1 px-4 space-y-2 mt-2">
                    <p className="px-4 text-[9px] font-mono opacity-40 uppercase tracking-[0.2em] mb-4">
                        Command_Modules
                    </p>

                    {navItems.map((item) => {
                        const active = pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <motion.div
                                    className={`
                    relative flex items-center gap-4 px-5 py-4 rounded-xl transition-all overflow-hidden
                    ${active
                                            ? "bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 border border-cyan-500/10"
                                            : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-[var(--text-primary)]"
                                        }
                  `}
                                >
                                    {/* Active Indicator Bar */}
                                    {active && (
                                        <motion.div
                                            layoutId="active_indicator"
                                            className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-500 rounded-r-full"
                                        />
                                    )}

                                    <span className="relative z-10">{item.icon}</span>
                                    <span className="relative z-10 text-[10px] font-mono tracking-widest uppercase font-black">
                                        {item.label}
                                    </span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* SYSTEM FOOTER */}
                <div className="p-6 border-t border-[var(--border-color)] bg-neutral-50 dark:bg-white/[0.02]">
                    <div className="space-y-3">
                        <Link
                            to="/"
                            className="flex items-center gap-4 text-[10px] font-mono opacity-40 hover:opacity-100 hover:text-cyan-500 transition-all group"
                        >
                            <Home size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                            <span className="uppercase tracking-[0.2em]">Exit_to_Mainframe</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-red-500 bg-red-500/5 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                        >
                            <LogOut size={14} />
                            <span className="text-[9px] font-mono tracking-widest uppercase font-bold">
                                Terminate_Session
                            </span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* 2. MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col relative h-full overflow-hidden bg-[var(--bg-main)]">

                {/* TOP BAR */}
                <header className="h-20 px-8 border-b border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-40">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <Terminal size={12} className="text-cyan-500" />
                            <span className="text-[9px] font-mono opacity-40 uppercase tracking-[0.3em]">
                                Secure_Node_Access
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)]">
                            <ShieldCheck size={14} className="text-green-500" />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest opacity-60">
                                Encrypted: AES-256
                            </span>
                        </div>

                        {/* Admin Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black italic shadow-lg shadow-cyan-500/20">
                            A
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE VIEWPORT */}
                <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                    <div className="max-w-6xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                transition={{ duration: 0.3, ease: "circOut" }}
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