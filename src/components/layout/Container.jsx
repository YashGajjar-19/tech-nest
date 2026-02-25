import React from 'react';
import { twMerge } from 'tailwind-merge';

export default function Container({ children, className, ...props }) {
    return (
        <div className={twMerge("max-w-7xl mx-auto px-6 w-full", className)} {...props}>
            {children}
        </div>
    );
}
