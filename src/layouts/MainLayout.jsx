import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import AuthModal from "@/components/auth/AuthModal"; // Import the modal
import ThemeToggle from "@/components/ui/ThemeToggle";
import Footer from "@/components/layout/Footer";
import { CommandProvider } from "@/context/CommandContext";
import CommandPalette from "@/components/common/CommandPalette";

export default function MainLayout() {
    const [isAuthOpen, setAuthOpen] = useState(false);
    const location = useLocation();

    return (
        <CommandProvider>
            <div className="min-h-screen bg-bg-main text-text-primary font-sans">
                <Navbar onOpenAuth={() => setAuthOpen(true)} />
                <ThemeToggle />
                <CommandPalette />

                <main className="pt-24 pb-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
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