import React from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export default function Card({
    children,
    className,
    hoverable = false,
    ...props
}) {
    const baseClasses = "rounded-2xl bg-bg-surface/50 backdrop-blur-md border border-border-subtle overflow-hidden";
    const hoverClasses = hoverable 
        ? "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.5)] hover:border-white/10 hover:bg-bg-surface/80" 
        : "";

    return (
        <div 
            className={twMerge(clsx(baseClasses, hoverClasses, className))}
            {...props}
        >
            {children}
        </div>
    );
}

// Optional sub-components for consistent Card struture
Card.Header = ({ children, className }) => (
    <div className={twMerge(clsx("px-6 py-5 border-b border-border-subtle", className))}>
        {children}
    </div>
);

Card.Body = ({ children, className }) => (
    <div className={twMerge(clsx("p-6", className))}>
        {children}
    </div>
);

Card.Footer = ({ children, className }) => (
    <div className={twMerge(clsx("px-6 py-4 bg-bg-secondary/50 border-t border-border-subtle", className))}>
        {children}
    </div>
);
