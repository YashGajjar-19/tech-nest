import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

export default function Tabs ( { tabs, defaultActive, onChange, className } )
{
    const [ activeTab, setActiveTab ] = useState( defaultActive || ( tabs && tabs.length > 0 ? tabs[ 0 ].id : null ) );

    useEffect( () =>
    {
        if ( defaultActive !== undefined )
        {
            setActiveTab( defaultActive );
        }
    }, [ defaultActive ] );

    const handleTabClick = ( id ) =>
    {
        setActiveTab( id );
        if ( onChange ) onChange( id );
    };

    return (
        <div className={ twMerge( "flex flex-wrap items-center gap-2", className ) }>
            { tabs.map( tab =>
            {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={ tab.id }
                        onClick={ () => handleTabClick( tab.id ) }
                        className={ twMerge(
                            "relative px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-300 outline-none",
                            isActive ? "text-white" : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                        ) }
                    >
                        { isActive && (
                            <motion.div
                                layoutId="active-tab-indicator"
                                className="absolute inset-0 bg-brand rounded-xl shadow-[0_0_12px_2px_var(--color-brand-glow)]"
                                initial={ false }
                                transition={ { type: "spring", stiffness: 400, damping: 30 } }
                            />
                        ) }
                        <span className="relative z-10 flex items-center gap-2">
                            { tab.icon && <span>{ tab.icon }</span> }
                            { tab.label }
                        </span>
                    </button>
                );
            } ) }
        </div>
    );
}
