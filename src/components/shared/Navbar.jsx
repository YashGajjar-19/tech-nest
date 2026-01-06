import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, User, Home, Swords, LogOut } from "lucide-react"; // Added LogOut
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";


import Logo from "@/components/ui/Logo";

export default function Navbar({ onOpenAuth }) {
    const { user, logout } = useAuth(); // Real Data!
    const isAdmin = user?.email?.includes("admin"); // Simple admin check

    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border-color)] py-3" : "bg-transparent py-6"}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* LOGO */}
                <Link to="/">
                    <Logo className="text-[var(--text-primary)]" />
                </Link>

                {/* CENTER LINKS */}
                <div className="hidden md:flex items-center gap-1">
                    <NavLink to="/" icon={<Home size={13} />} label="BASE" active={location.pathname === "/"} />
                    <NavLink to="/battle" icon={<Swords size={13} />} label="BATTLE" active={location.pathname === "/battle"} />
                </div>

                {/* RIGHT ACTIONS */}
                <div className="flex items-center gap-4">
                    
                    {isAdmin && (
                        <Link to="/admin/inventory">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="gap-2 text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-500 transition-all"
                            >
                                <span className="flex items-center gap-2">
                                    <LayoutDashboard size={14} /> 
                                    <span>ADMIN</span>
                                </span>
                            </Button>
                        </Link>
                    )}

                    {!user ? (
                        <Button onClick={onOpenAuth} variant="primary" size="sm" className="rounded-full">
                            SIGN_IN
                        </Button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-widest">Session_Active</p>
                                <p className="text-[10px] font-bold text-[var(--text-primary)]">{user.email.split('@')[0]}</p>
                            </div>
                            <button onClick={async () => await logout()} className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:border-red-500  transition-all">
                                <LogOut size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

function NavLink({ to, icon, label, active }) {
    return (
        <Link to={to} className="relative px-4 py-2 group">
            <div className={`relative z-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${active ? "text-cyan-500" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"}`}>
                {icon} {label}
            </div>
            {active && <motion.div layoutId="nav_pill" className="absolute inset-0 bg-cyan-500/10 rounded-full" />}
        </Link>
    );
}