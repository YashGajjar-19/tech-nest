import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import HeroHeadline from "./HeroHeadline";
import CommandSearch from "./CommandSearch";
import TrendingSearches from "./TrendingSearches";
import AIPreview from "./AIPreview";
import HeroBackground from "./HeroBackground";

export default function Hero ()
{
    return (
        <section id="layout-hero" className="relative min-h-[90vh] pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center overflow-hidden bg-bg-main">
            <HeroBackground />

            <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center text-center">
                <HeroHeadline />
                <CommandSearch />
                <TrendingSearches />
                <AIPreview />
            </div>

            <ScrollIndicator />
        </section>
    );
}

function ScrollIndicator ()
{
    return (
        <motion.div
            initial={ { opacity: 0 } }
            animate={ { opacity: 1 } }
            transition={ { delay: 1.5, duration: 1 } }
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary"
        >
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Scroll</span>
            <motion.div
                animate={ { y: [ 0, 5, 0 ] } }
                transition={ { duration: 2, repeat: Infinity, ease: "easeInOut" } }
            >
                <ArrowDown size={ 14 } className="opacity-50" />
            </motion.div>
        </motion.div>
    );
}
