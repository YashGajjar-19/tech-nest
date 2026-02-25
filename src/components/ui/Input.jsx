import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

const Input = forwardRef( ( {
    id,
    label,
    error,
    leftIcon,
    rightIcon,
    className,
    containerClassName,
    helperText,
    type = "text",
    ...props
}, ref ) =>
{

    return (
        <div className={ twMerge( clsx( "flex flex-col gap-1.5 w-full", containerClassName ) ) }>
            { label && (
                <label htmlFor={ id } className="text-sm font-medium text-text-secondary">
                    { label }
                </label>
            ) }

            <div className="relative group">
                {/* ICON LEFT */ }
                { leftIcon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors duration-300 pointer-events-none">
                        { leftIcon }
                    </div>
                ) }

                <input
                    ref={ ref }
                    id={ id }
                    type={ type }
                    className={ twMerge( clsx(
                        "w-full bg-glass-bg border border-border-subtle rounded-xl text-text-primary placeholder:text-text-muted",
                        "h-12 text-base transition-all duration-300 ease-out outline-none",
                        "hover:border-white/10 hover:bg-white/5",
                        "focus:border-brand focus:shadow-[0_0_12px_2px_var(--color-brand-glow)] focus:bg-transparent",
                        leftIcon ? "pl-11" : "pl-4",
                        rightIcon ? "pr-11" : "pr-4",
                        error && "border-red-500 focus:border-red-500 text-red-500 focus:shadow-[0_0_12px_2px_rgba(239,68,68,0.2)]",
                        className
                    ) ) }
                    { ...props }
                />

                {/* ICON RIGHT */ }
                { rightIcon && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
                        { rightIcon }
                    </div>
                ) }
            </div>

            {/* HELPER OR ERROR TEXT */ }
            { ( helperText || error ) && (
                <p className={ twMerge( clsx( "text-xs font-medium ml-1", error ? "text-red-500" : "text-text-muted" ) ) }>
                    { error || helperText }
                </p>
            ) }
        </div>
    );
} );

Input.displayName = 'Input';

export default Input;