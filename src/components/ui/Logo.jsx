import React from "react";
import { motion } from "framer-motion";

// Product Mark (Icon Only)
export const LogoIcon = ({ className = "text-text-primary", size = 30 }) => {
    // Elegant spring physics for a premium, calm feel
    const springConfig = { type: "spring", stiffness: 220, damping: 18 };

    const pathVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.95 },
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
            className={className}
        >
            {/* Bottom Layer: Knowledge (Base, same size as top) */}
            <motion.path
                d="M3 16 L12 20.5 L21 16"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
                custom={0} // Animate first
            />
            {/* Middle Layer: Understanding (Slightly smaller, Theme Accent/Blue) */}
            <motion.path
                d="M6 13.5 L12 16.5 L18 13.5"
                className="text-brand"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
                custom={1}
            />
            {/* Top Layer: Decision (Clarity point, same size as bottom) */}
            <motion.path
                d="M12 3.5 L3 8 L12 12.5 L21 8 Z"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
                custom={2} // Animate last
            />
        </svg>
    );
};

// Primary Logo (Icon + Text)
const Logo = ({ 
    className = "text-text-primary", 
    size = 30, 
    withText = false, 
    textClassName = "font-bold tracking-tight text-lg text-text-primary",
    text = "Tech Nest"
}) => {
    // If text is not requested, return just the Product Mark (compatible with existing code)
    if (!withText) {
        return <LogoIcon className={className} size={size} />;
    }

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <LogoIcon size={size} />
            <span className={textClassName}>{text}</span>
        </div>
    );
};

export default Logo;
