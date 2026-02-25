import React from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

const VARIANTS = {
    default: "bg-bg-surface text-text-secondary border border-border-subtle",
    primary: "bg-brand/10 text-brand border border-brand/20",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    destructive: "bg-red-500/10 text-red-500 border border-red-500/20",
    outline: "bg-transparent text-text-muted border border-border-subtle",
};

export default function Badge ( {
    children,
    variant = "default",
    className,
    icon,
    ...props
} )
{
    return (
        <span
            className={ twMerge( clsx(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors duration-200",
                VARIANTS[ variant ],
                className
            ) ) }
            { ...props }
        >
            { icon && <span className="shrink-0">{ icon }</span> }
            { children }
        </span>
    );
}
