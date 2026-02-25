import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, LogIn, LogOut, LayoutDashboard, User, Command } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCommand } from "@/context/CommandContext";
import Logo from "@/components/ui/Logo";

const NAV_LINKS = [
    { label: "Devices", to: "/devices" },
    { label: "Compare", to: "/battle" },
    { label: "News", to: "/news" },
    { label: "AI", to: "/ai" }
];

export default function Navbar ( { onOpenAuth } )
{
    const { user, logout, isAdmin } = useAuth();
    const location = useLocation();
    const { toggleCommand } = useCommand();

    // Scroll Effects
    const { scrollY } = useScroll();
    const navY = useTransform( scrollY, [ 0, 50 ], [ 0, -10 ] );
    const navBlur = useTransform( scrollY, [ 0, 50 ], [ "blur(0px)", "blur(24px)" ] );
    const navBg = useTransform( scrollY, [ 0, 50 ], [ "rgba(var(--bg-main), 0)", "rgba(var(--bg-main), 0.7)" ] );
    const navBorder = useTransform( scrollY, [ 0, 50 ], [ "translateY(-100%)", "translateY(0%)" ] );

    // Scroll Effects

    return (
        <motion.nav
            style={ { y: navY, backgroundColor: navBg, backdropFilter: navBlur } }
            className="fixed top-0 inset-x-0 z-50 h-20 flex items-center transition-all duration-300 pointer-events-auto"
        >
            {/* Scroll Border Indicator */ }
            <motion.div
                style={ { y: navBorder } }
                className="absolute bottom-0 left-0 right-0 h-px bg-border-color opacity-50"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">

                {/* 1. LOGO */ }
                <Link to="/" className="flex items-center gap-3 relative z-50 group outline-none">
                    <Logo className="text-text-primary group-hover:scale-105 transition-transform duration-500 ease-spring" />
                    <span className="font-semibold tracking-tight text-lg text-text-primary hidden sm:block">Tech Nest</span>
                </Link>

                {/* 2. DESKTOP NAV LINKS */ }
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
                    { NAV_LINKS.map( link => (
                        <NavLink key={ link.label } to={ link.to } label={ link.label } active={ location.pathname === link.to } />
                    ) ) }
                </div>

                {/* 3. RIGHT ACTIONS */ }
                <div className="flex items-center gap-4 relative z-50">

                    {/* COMMAND SEARCH */ }
                    <button
                        onClick={ toggleCommand }
                        className="group hidden sm:flex items-center gap-3 px-3 py-2 rounded-xl bg-transparent hover:bg-bg-card border border-transparent hover:border-border-color transition-all duration-300 ease-spring outline-none"
                    >
                        <Search size={ 16 } strokeWidth={ 2 } className="text-text-secondary group-hover:text-text-primary transition-colors" />
                        <span className="text-sm font-medium text-text-secondary">Search</span>
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-bg-main border border-border-color">
                            <Command size={ 10 } className="text-text-secondary" />
                            <span className="text-[10px] font-semibold text-text-secondary">K</span>
                        </div>
                    </button>

                    {/* MOBILE SEARCH ICON */ }
                    <button onClick={ toggleCommand } className="sm:hidden p-2 text-text-secondary">
                        <Search size={ 18 } />
                    </button>

                    <div className="w-px h-5 bg-border-color hidden sm:block" />

                    {/* AUTH / USER */ }
                    <div className="hidden sm:flex items-center gap-2">
                        { isAdmin && (
                            <Link to="/admin/inventory" className="p-2 rounded-xl text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors group">
                                <LayoutDashboard size={ 18 } className="group-hover:scale-110 transition-transform" />
                            </Link>
                        ) }

                        { !user ? (
                            <button onClick={ onOpenAuth } className="flex items-center gap-2 px-4 py-2 rounded-xl bg-text-primary text-bg-main font-medium text-sm hover:scale-105 transition-transform duration-300 ease-spring shadow-sm">
                                <LogIn size={ 16 } />
                                <span>Login</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-1">
                                <Link to="/profile" className="p-2 rounded-xl text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors group">
                                    <User size={ 18 } className="group-hover:scale-110 transition-transform" />
                                </Link>
                                <button onClick={ async () => await logout() } className="p-2 rounded-xl text-text-secondary hover:bg-red-500/10 hover:text-red-500 transition-colors group">
                                    <LogOut size={ 18 } className="group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        ) }
                    </div>

                </div>
            </div>
        </motion.nav>
    );
}

// PREMIUM NAV LINK COMPONENT
function NavLink ( { to, label, active } )
{
    return (
        <Link
            to={ to }
            className="relative py-2 px-1 group outline-none flex flex-col items-center"
        >
            <span className={ `text-sm font-medium transition-colors duration-300 ${ active ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary" }` }>
                { label }
            </span>
            {/* SUBTLE INDICATOR */}
            <div className={`absolute -bottom-1 h-[3px] rounded-t-full transition-all duration-300 ease-spring ${active ? "w-full bg-text-primary" : "w-0 bg-brand group-hover:w-full opacity-0 group-hover:opacity-100"}`} />
        </Link>
    );
}