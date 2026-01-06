import { Sun, Moon, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    const handleToggle = () => {
        toggleTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleToggle}
            className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-2xl bg-[var(--bg-card)] dark:bg-[var(--bg-main)] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[var(--border-color)] flex items-center justify-center transition-colors group"
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? (
                <Sun size={24} className="text-cyan-500 fill-cyan-500/10" />
            ) : (
                <Moon size={24} className="text-cyan-500 fill-cyan-500/10" />
            )}
        </motion.button>
    );
}