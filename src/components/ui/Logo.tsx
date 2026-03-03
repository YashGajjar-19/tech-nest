"use client";

import React from "react";
import { motion, Transition } from "framer-motion";

export const LogoIcon = ({
  className = "text-foreground",
  size = 28,
}: {
  className?: string;
  size?: number;
}) => {
  const transition: Transition = {
    type: "spring",
    stiffness: 260,
    damping: 22,
  };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial="hidden"
      animate="visible"
    >
      {/* Base Platform */}
      <motion.rect
        x="4"
        y="15"
        width="16"
        height="2"
        rx="1"
        variants={{
          hidden: { opacity: 0, y: 8 },
          visible: { opacity: 1, y: 0, transition },
        }}
        fill="currentColor"
      />

      {/* Middle Layer */}
      <motion.rect
        x="6"
        y="11"
        width="12"
        height="2"
        rx="1"
        className="text-accent"
        variants={{
          hidden: { opacity: 0, y: 8 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { ...transition, delay: 0.05 },
          },
        }}
        fill="currentColor"
      />

      {/* Top Signal */}
      <motion.rect
        x="9"
        y="7"
        width="6"
        height="2"
        rx="1"
        variants={{
          hidden: { opacity: 0, y: 8 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { ...transition, delay: 0.1 },
          },
        }}
        fill="currentColor"
      />
    </motion.svg>
  );
};

export default function Logo({
  size = 28,
  withText = true,
  className = "",
}: {
  size?: number;
  withText?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoIcon size={size} />
      {withText && (
        <span className="font-semibold tracking-[-0.02em] text-lg font-heading hidden sm:block">
          Tech Nest
        </span>
      )}
    </div>
  );
}
