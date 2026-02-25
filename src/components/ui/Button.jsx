import React from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
    primary: "bg-brand text-white border border-transparent shadow-[0_0_0_0_var(--color-brand-glow)] hover:shadow-[0_0_16px_4px_var(--color-brand-glow)] hover:scale-[1.02]",
    secondary: "bg-bg-surface text-text-primary border border-border-subtle hover:bg-white/5 hover:border-white/10",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-glass-bg border border-transparent",
    destructive: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-[0_0_16px_4px_rgba(239,68,68,0.2)] hover:scale-[1.02]",
};

const SIZES = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg font-semibold",
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    className,
    disabled = false,
    loading = false,
    leftIcon,
    rightIcon,
    ...props
}) {
    const baseClasses = "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-brand/50 active:scale-95 disabled:pointer-events-none disabled:opacity-50";
    
    return (
        <button
            className={twMerge(clsx(baseClasses, VARIANTS[variant], SIZES[size], className))}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : leftIcon ? (
                <span className="shrink-0">{leftIcon}</span>
            ) : null}
            
            <span>{children}</span>

            {!loading && rightIcon && (
                <span className="shrink-0">{rightIcon}</span>
            )}
        </button>
    );
}