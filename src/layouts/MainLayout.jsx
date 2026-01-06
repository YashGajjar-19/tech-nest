import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import AuthModal from "@/features/auth/components/AuthModal"; // Import the modal
import ThemeToggle from "@/components/ui/ThemeToggle";
import Footer from "@/components/shared/Footer";

export default function MainLayout() {
    const [isAuthOpen, setAuthOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans">
            <Navbar onOpenAuth={() => setAuthOpen(true)} />
            <ThemeToggle />

            <main className="pt-24 pb-20">
                <Outlet />
            </main>

            <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />

            <Footer />
        </div>
    );
}