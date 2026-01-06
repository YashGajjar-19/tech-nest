import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // This imports the file we just created above

export default function Button({
    children,
    variant = "primary", // primary, outline, ghost, danger
    size = "md",
    isLoading,
    icon: Icon,
    className,
    ...props
}) {
    const baseStyles = "relative overflow-hidden font-black uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 rounded-xl";

    const variants = {
        primary: "bg-[var(--text-primary)] text-[var(--bg-card)] hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-transparent",
        outline: "bg-transparent border border-[var(--border-color)] text-[var(--text-primary)] hover:border-cyan-500 hover:text-cyan-500",
        ghost: "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5",
        danger: "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"
    };

    const sizes = {
        sm: "px-4 py-2 text-[10px]",
        md: "px-6 py-3 text-xs",
        lg: "px-8 py-4 text-sm"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : Icon && <Icon size={16} />}
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
}