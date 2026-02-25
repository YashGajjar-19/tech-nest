import React from 'react';
import { twMerge } from 'tailwind-merge';

export default function Section({ children, className, ...props }) {
    return (
        <section className={twMerge("py-24 w-full", className)} {...props}>
            {children}
        </section>
    );
}
