import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import AuthModal from "@/components/auth/AuthModal"; // Import the modal
import ThemeToggle from "@/components/ui/ThemeToggle";
import Footer from "@/components/layout/Footer";
import { CommandProvider } from "@/context/CommandContext";
import CommandPalette from "@/components/common/CommandPalette";
import NavProgress from "@/components/layout/NavProgress";
import MobileMenu from "@/components/layout/MobileMenu";

export default function MainLayout() {
    const [isAuthOpen, setAuthOpen] = useState(false);
    const location = useLocation();

    return (
        <CommandProvider>
            <div className="min-h-screen bg-bg-main text-text-primary font-sans">
                <NavProgress />
                <Navbar onOpenAuth={() => setAuthOpen(true)} />
                <MobileMenu onOpenAuth={() => setAuthOpen(true)} />
                <ThemeToggle />
                <CommandPalette />

                <main className="pt-24 pb-20">
                    <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, scale: 0.99 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.99 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                            >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>

                <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />

                <Footer />
            </div>
        </CommandProvider>
    );
}