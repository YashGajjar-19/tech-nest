import { motion } from "framer-motion";
import { BrainCircuit, Zap, Sparkles, LayoutPanelLeft } from "lucide-react";

const FEATURES = [
    {
        icon: <BrainCircuit size={ 20 } strokeWidth={ 1.5 } />,
        title: "AI Powered Comparisons",
        desc: "Understand devices instantly with intelligent comparisons."
    },
    {
        icon: <Sparkles size={ 20 } strokeWidth={ 1.5 } />,
        title: "Smart Recommendations",
        desc: "Find the best device based on your real needs."
    },
    {
        icon: <LayoutPanelLeft size={ 20 } strokeWidth={ 1.5 } />,
        title: "Clean Spec Experience",
        desc: "No clutter. Just clear and structured information."
    },
    {
        icon: <Zap size={ 20 } strokeWidth={ 1.5 } />,
        title: "Lightning Fast Discovery",
        desc: "Search, compare and explore devices faster than ever."
    }
];

export default function Features ()
{
    return (
        <section className="relative py-24 md:py-32 overflow-hidden bg-bg-main" id="layout-features">
            {/* Ambient Background */ }
            <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
                <div className="w-[800px] h-[800px] bg-hyper-cyan/5 blur-[120px] rounded-full translate-x-1/4 translate-y-1/4" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* SECTION HEADING */ }
                <div className="text-center md:text-left mb-16 md:mb-24 max-w-3xl">
                    <motion.div
                        initial={ { opacity: 0, y: 20 } }
                        whileInView={ { opacity: 1, y: 0 } }
                        viewport={ { once: true } }
                        transition={ { duration: 0.5 } }
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-hyper-cyan/10 border border-hyper-cyan/20 text-hyper-cyan text-sm font-medium mb-6"
                    >
                        <Sparkles size={ 14 } />
                        <span>The Modern Standard</span>
                    </motion.div>

                    <motion.h2
                        initial={ { opacity: 0, y: 20 } }
                        whileInView={ { opacity: 1, y: 0 } }
                        viewport={ { once: true } }
                        transition={ { duration: 0.5, delay: 0.1 } }
                        className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-text-primary mb-6 leading-[1.1]"
                    >
                        Built for <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-white/80 to-white/50">Modern Tech Discovery.</span>
                    </motion.h2>

                    <motion.p
                        initial={ { opacity: 0, y: 20 } }
                        whileInView={ { opacity: 1, y: 0 } }
                        viewport={ { once: true } }
                        transition={ { duration: 0.5, delay: 0.2 } }
                        className="text-lg text-text-secondary leading-relaxed max-w-xl"
                    >
                        Tech Nest is not just a database. It's an intelligent platform designed to help you make smarter decisions, faster.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* LEFT: Dashboard Preview Highlight (Advanced Version) */ }
                    <motion.div
                        initial={ { opacity: 0, x: -40 } }
                        whileInView={ { opacity: 1, x: 0 } }
                        viewport={ { once: true } }
                        transition={ { duration: 0.7, ease: "easeOut" } }
                        className="lg:col-span-7 relative"
                    >
                        <div className="relative rounded-3xl overflow-hidden border border-border-color bg-bg-card/40 backdrop-blur-3xl aspect-4/3 sm:aspect-16/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-center p-8 group">
                            {/* Glow from behind */ }
                            <div className="absolute inset-0 bg-linear-to-tr from-hyper-cyan/5 via-transparent to-hyper-cyan/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                            {/* Abstract mock UI */ }
                            <div className="w-full h-full relative z-10 flex flex-col gap-4">
                                {/* Top Bar */ }
                                <div className="flex items-center justify-between border-b border-border-color/50 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-bg-main border border-border-color flex items-center justify-center text-text-secondary shadow-inner">
                                            <BrainCircuit size={ 20 } />
                                        </div>
                                        <div>
                                            <div className="h-4 w-32 bg-border-color/50 rounded-md mb-2" />
                                            <div className="h-3 w-24 bg-border-color/30 rounded-md" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-bg-main border border-border-color" />
                                        <div className="h-8 w-8 rounded-lg bg-bg-main border border-border-color" />
                                    </div>
                                </div>

                                {/* Main Content Area */ }
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    <div className="rounded-xl border border-border-color/50 bg-bg-main/50 p-4 flex flex-col gap-3">
                                        <div className="h-3 w-1/2 bg-border-color/40 rounded-full" />
                                        <div className="flex-1 bg-border-color/10 rounded-lg flex items-end p-2 gap-2">
                                            <div className="w-1/4 h-1/3 bg-hyper-cyan/20 rounded-sm" />
                                            <div className="w-1/4 h-2/3 bg-hyper-cyan/40 rounded-sm" />
                                            <div className="w-1/4 h-full bg-hyper-cyan/60 rounded-sm" />
                                            <div className="w-1/4 h-1/2 bg-hyper-cyan/30 rounded-sm" />
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-border-color/50 bg-bg-main/50 p-4 flex flex-col gap-3">
                                        <div className="h-3 w-1/3 bg-border-color/40 rounded-full" />
                                        <div className="flex-1 flex flex-col gap-2 justify-center">
                                            <div className="h-2 w-full bg-border-color/20 rounded-full relative overflow-hidden">
                                                <div className="absolute top-0 left-0 h-full w-3/4 bg-hyper-cyan/50 rounded-full" />
                                            </div>
                                            <div className="h-2 w-full bg-border-color/20 rounded-full relative overflow-hidden">
                                                <div className="absolute top-0 left-0 h-full w-1/2 bg-text-secondary/50 rounded-full" />
                                            </div>
                                            <div className="h-2 w-full bg-border-color/20 rounded-full relative overflow-hidden">
                                                <div className="absolute top-0 left-0 h-full w-5/6 bg-text-primary/50 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating highlight badge */ }
                            <motion.div
                                animate={ { y: [ 0, -10, 0 ] } }
                                transition={ { repeat: Infinity, duration: 4, ease: "easeInOut" } }
                                className="absolute -bottom-4 -right-4 sm:bottom-8 sm:-right-8 bg-bg-card border border-border-color backdrop-blur-md shadow-premium-xl rounded-2xl p-4 flex items-center gap-3 z-20"
                            >
                                <div className="w-10 h-10 rounded-full bg-hyper-cyan/20 flex items-center justify-center text-hyper-cyan">
                                    <Zap size={ 18 } className="fill-hyper-cyan/20" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-text-primary">99.9% Faster</p>
                                    <p className="text-xs text-text-secondary">AI processing</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* RIGHT: Feature List */ }
                    <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-4">
                        { FEATURES.map( ( feature, i ) => (
                            <motion.div
                                key={ i }
                                initial={ { opacity: 0, y: 20 } }
                                whileInView={ { opacity: 1, y: 0 } }
                                viewport={ { once: true } }
                                transition={ { duration: 0.5, delay: i * 0.1 } }
                                className="group relative flex items-start gap-5 p-5 sm:p-6 rounded-2xl bg-linear-to-b from-white/5 to-transparent border border-white/5 hover:border-hyper-cyan/30 transition-all duration-300 overflow-hidden"
                            >
                                {/* Hover Glow */ }
                                <div className="absolute inset-0 bg-hyper-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none blur-xl" />

                                <div className="relative z-10 w-12 h-12 shrink-0 rounded-xl bg-bg-main border border-border-color flex items-center justify-center text-text-secondary group-hover:text-hyper-cyan group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-300">
                                    { feature.icon }
                                </div>
                                <div className="relative z-10 mt-0.5">
                                    <h4 className="text-base sm:text-lg font-semibold text-text-primary mb-1 transition-colors">{ feature.title }</h4>
                                    <p className="text-sm text-text-secondary leading-relaxed group-hover:text-text-secondary/90 transition-colors">
                                        { feature.desc }
                                    </p>
                                </div>
                            </motion.div>
                        ) ) }
                    </div>
                </div>
            </div>
        </section>
    );
}
