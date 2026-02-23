import { useState, useMemo } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn ( ...inputs )
{
    return twMerge( clsx( inputs ) );
}

export default function SpecsTabs ( { device } )
{
    // Determine categories based on device.device_specs
    // Use an explicit order here so Display, Performance, Camera etc. are first
    const preferredOrder = [ "Display", "Performance", "Camera", "Battery", "Connectivity", "Build", "Audio", "Software", "Other" ];

    const specsByCategory = useMemo( () =>
    {
        if ( !device?.device_specs ) return {};

        const grouped = device.device_specs.reduce( ( acc, spec ) =>
        {
            const cat = spec.spec_definitions?.category || "Other";
            if ( !acc[ cat ] ) acc[ cat ] = [];
            acc[ cat ].push( spec );
            return acc;
        }, {} );

        // Sort keys by preferred order
        const sortedKeys = Object.keys( grouped ).sort( ( a, b ) =>
        {
            const indexA = preferredOrder.indexOf( a );
            const indexB = preferredOrder.indexOf( b );
            if ( indexA === -1 && indexB !== -1 ) return 1;
            if ( indexB === -1 && indexA !== -1 ) return -1;
            if ( indexA === -1 && indexB === -1 ) return a.localeCompare( b );
            return indexA - indexB;
        } );

        const sortedGrouped = {};
        for ( const key of sortedKeys ) sortedGrouped[ key ] = grouped[ key ];
        return sortedGrouped;
    }, [ device ] );

    const categories = Object.keys( specsByCategory );
    const [ activeTab, setActiveTab ] = useState( categories[ 0 ] || "" );

    if ( categories.length === 0 ) return null;

    const currentSpecs = specsByCategory[ activeTab ] || [];

    return (
        <section className="mb-24">
            <h2 className="text-2xl font-bold mb-8 text-text-primary uppercase tracking-tight">Technical Specifications</h2>

            <div className="flex flex-col md:flex-row gap-12">
                {/* TABS MENU */ }
                <div className="md:w-64 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar pb-4 md:pb-0">
                    { categories.map( ( cat ) => (
                        <button
                            key={ cat }
                            onClick={ () => setActiveTab( cat ) }
                            className={ cn(
                                "flex-1 md:flex-none text-left px-5 py-4 rounded-2xl text-sm font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap",
                                activeTab === cat
                                    ? "bg-text-primary text-bg-main shadow-premium-md scale-100"
                                    : "bg-transparent text-text-secondary hover:bg-bg-card hover:text-text-primary scale-[0.98]"
                            ) }
                        >
                            { cat }
                        </button>
                    ) ) }
                </div>

                {/* TAB CONTENT */ }
                <div className="flex-1 min-w-0 bg-bg-card border border-border-color rounded-3xl p-8 md:p-12 animate-in fade-in slide-in-from-right-8 duration-500 ease-spring">
                    <h3 className="text-xl font-bold text-text-primary mb-8 pb-4 border-b border-border-color uppercase tracking-tight">
                        { activeTab } Overview
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        { currentSpecs.map( ( spec ) => (
                            <div key={ spec.spec_key } className="flex gap-4 group">
                                <div className="w-1/3 shrink-0 text-xs font-bold text-text-secondary uppercase tracking-widest pt-1 group-hover:text-hyper-cyan transition-colors">
                                    { spec.spec_definitions?.display_label }
                                </div>
                                <div className="flex-1 font-mono text-[15px] text-text-primary leading-relaxed wrap-break-word">
                                    { spec.raw_value }
                                    { spec.spec_definitions?.unit && (
                                        <span className="text-xs text-text-secondary ml-1">{ spec.spec_definitions.unit }</span>
                                    ) }
                                </div>
                            </div>
                        ) ) }
                    </div>
                </div>
            </div>
        </section>
    );
}
