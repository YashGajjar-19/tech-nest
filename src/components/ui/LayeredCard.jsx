import React from "react";
import { motion } from "framer-motion";

const LayeredCard = ({
    children,
    className = "",
    delay = 0,
    hoverEffect = true,
    padding = "p-6",
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: delay,
            }}
            whileHover={
                hoverEffect
                    ? {
                          y: -4,
                          transition: { type: "spring", stiffness: 400, damping: 25 },
                      }
                    : {}
            }
            className={`
                relative 
                bg-bg-card 
                rounded-2xl 
                border border-border-color 
                shadow-premium-sm 
                overflow-hidden
                ${hoverEffect ? "hover:border-color-strong hover:shadow-premium-md transition-shadow duration-300" : ""}
                ${className}
            `}
        >
            {/* Subtle top glare/layer effect for depth */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
            
            <div className={`relative z-10 ${padding}`}>
                {children}
            </div>
        </motion.div>
    );
};

export default LayeredCard;
