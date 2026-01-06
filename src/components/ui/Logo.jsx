import React from "react";
import { motion } from "framer-motion";

const Logo = ({ className = "text-[var(--text-primary)]", size = 30 }) => {
    const springConfig = { type: "spring", stiffness: 200, damping: 12 };

    const pathVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.8 },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                ...springConfig,
                delay: custom * 0.15,
            },
        }),
    };

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <motion.path
                    d="M12 2L2 7l10 5l10-5l-10-5z"
                    variants={pathVariants}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                />
                <motion.path
                    d="M2 12l10 5l10-5"
                    variants={pathVariants}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                />
                <motion.path
                    d="M2 17l10 5l10-5"
                    variants={pathVariants}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                />
            </svg>
            <span className="text-2xl font-mono font-bold tracking-tight">Tech Nest</span>
        </div>
    );
};

export default Logo;
