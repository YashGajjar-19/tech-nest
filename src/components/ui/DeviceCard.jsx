import { motion } from "framer-motion";
import { ChevronRight, Cpu, Battery, Camera, Maximize, Heart, Swords, RefreshCw, BarChart } from "lucide-react";

export default function DeviceCard ( { product, onToggle, score = 92 } )
{
    if ( !product ) return null;

    const {
        model_name,
        image_url,
        brands,
        device_specs
    } = product;

    // Fast mapping of important specs
    const displaySize = device_specs?.find( s => s.spec_key === 'display_size' )?.raw_value || '6.8"';
    const processor = device_specs?.find( s => s.spec_key === 'processor_name' )?.raw_value || 'Custom SoC';
    const battery = device_specs?.find( s => s.spec_key === 'battery_capacity_mah' )?.raw_value || '5000mAh';

    return (
        <motion.div
            whileHover={ { scale: 1.03, y: -6 } }
            transition={ { duration: 0.25, ease: "easeOut" } }
            className="group relative flex flex-col bg-bg-card/60 backdrop-blur-3xl border border-border-color rounded-2xl p-4 sm:p-5 hover:border-hyper-cyan/50 hover:shadow-premium-xl transition-all duration-300 isolate w-full"
        >
            {/* Ambient Glow */ }
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-hyper-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10 bg-blend-screen" />

            {/* Top Row: Score & Fav */ }
            <div className="absolute top-4 left-4 z-20 flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-bg-main/80 backdrop-blur-md border border-border-color shadow-sm group-hover:border-hyper-cyan/30 transition-colors pointer-events-none">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest leading-none mb-0.5 opacity-80">TN</span>
                <span className="text-sm font-black text-hyper-cyan leading-none">{ score }</span>
            </div>

            <button className="absolute top-4 right-4 z-20 p-2 rounded-full bg-bg-main/50 text-text-secondary hover:text-red-500 hover:bg-bg-main transition-colors backdrop-blur-md opacity-0 group-hover:opacity-100 outline-none">
                <Heart size={ 16 } />
            </button>

            {/* DEVICE IMAGE */ }
            <div
                onClick={ onToggle }
                className="relative h-48 w-full mb-6 mt-6 flex items-center justify-center cursor-pointer pointer-events-auto"
            >
                {/* Simulated Skeleton Behind Image */ }
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div className="w-32 h-32 rounded-full bg-bg-main/50 blur-xl group-hover:bg-hyper-cyan/10 transition-colors duration-500" />
                </div>

                <img
                    src={ image_url || "https://images.unsplash.com/photo-1598327105666-5b89351cb31b?q=80&w=400&auto=format&fit=crop" }
                    alt={ model_name }
                    className="h-full object-contain drop-shadow-2xl transition-transform duration-500 ease-in-out group-hover:scale-110"
                    loading="lazy"
                />
            </div>

            {/* DETAILS */ }
            <div className="mb-4 cursor-pointer" onClick={ onToggle }>
                <span className="text-[11px] font-semibold tracking-widest uppercase text-text-secondary mb-1 block group-hover:text-hyper-cyan transition-colors">
                    { brands?.name || "GENERIC" }
                </span>
                <h3 className="text-lg md:text-xl font-bold tracking-tight text-text-primary line-clamp-2 leading-tight">
                    { model_name }
                </h3>
            </div>

            {/* KEY SPECS TEASER */ }
            <div className="flex flex-wrap gap-2 mb-6">
                <SpecPill icon={ <Maximize size={ 12 } /> } value={ displaySize } />
                <SpecPill icon={ <Cpu size={ 12 } /> } value={ processor } />
                <SpecPill icon={ <Battery size={ 12 } /> } value={ battery } />
            </div>

            {/* ACTIONS */ }
            <div className="mt-auto flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={ onToggle }
                    className="flex-1 py-3 px-4 rounded-xl relative overflow-hidden bg-text-primary text-bg-main text-xs font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-premium-md transition-all ease-spring"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        View Specs
                        <ChevronRight size={ 14 } />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
                </button>
                <button
                    onClick={ ( e ) => { e.stopPropagation(); /* compare logic later */ } }
                    className="py-3 px-4 rounded-xl bg-bg-main border border-border-color text-text-primary hover:bg-bg-card hover:border-hyper-cyan/50 transition-colors flex items-center justify-center relative group/btn"
                    title="Compare"
                >
                    <RefreshCw size={ 16 } className="text-text-secondary group-hover/btn:text-hyper-cyan transition-colors" />
                </button>
            </div>
        </motion.div>
    );
}

function SpecPill ( { icon, value } )
{
    if ( !value || value === 'N/A' || value === 'Unknown' ) return null;
    return (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-bg-main border border-transparent group-hover:border-border-color/50 transition-colors text-[11px] font-medium text-text-secondary">
            <span className="opacity-50 group-hover:text-hyper-cyan group-hover:opacity-100 transition-colors">{icon}</span>
            <span className="truncate max-w-[80px] group-hover:text-text-primary transition-colors">{value}</span>
        </div>
    );
}
