import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Swords, Sparkles, Check, ChevronRight } from "lucide-react";

export default function CompareHighlight() {
    
    // Abstracting out the mock data for the visual demo
    const MOCK_COMPARISON = [
        { label: "Performance", left: "98", right: "95", leftWins: true },
        { label: "Camera", left: "94", right: "97", leftWins: false },
        { label: "Battery", left: "96", right: "92", leftWins: true },
        { label: "Display", left: "95", right: "96", leftWins: false },
    ];

    return (
        <section className="relative py-24 md:py-32 overflow-hidden bg-bg-main border-t border-border-color/50" id="compare-layout">
            
            {/* Background elements tailored for 'analytical & intelligent' feel */}
            <div className="absolute inset-0 pointer-events-none -z-10 group">
                <div className="absolute top-0 right-0 w-full h-px bg-linear-to-r from-transparent via-hyper-cyan/30 to-transparent" />
                {/* Subtle Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[40px_40px]" />
                {/* Glowing divider mock background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-3/4 bg-linear-to-b from-transparent via-hyper-cyan/20 to-transparent hidden lg:block" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    
                    {/* LEFT SIDE: CONTENT */}
                    <div className="flex flex-col items-start relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="w-16 h-16 rounded-[1.25rem] bg-bg-card border border-border-color flex items-center justify-center text-text-primary shadow-premium-md mb-8 relative"
                        >
                            <div className="absolute inset-0 bg-hyper-cyan/5 rounded-[1.25rem] blur-md" />
                            <Swords size={28} className="relative z-10" />
                        </motion.div>

                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-text-primary mb-6 leading-[1.1]"
                            id="heading"
                        >
                            Compare Devices <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-hyper-cyan to-white/70">Like Never Before.</span>
                        </motion.h2>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg text-text-secondary leading-relaxed mb-10 max-w-lg"
                            id="desc"
                        >
                            Stop cross-referencing tabs. See performance, camera, battery, and real-world value differences instantly with our intelligent side-by-side engine.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
                        >
                            <Link 
                                to="/compare" 
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-text-primary text-bg-main text-sm font-semibold hover:scale-105 hover:shadow-premium-xl transition-all duration-300 ease-spring"
                            >
                                Start Comparing
                                <ArrowRight size={16} />
                            </Link>
                            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-bg-card border border-border-color text-text-primary text-sm font-medium hover:bg-bg-main hover:border-text-primary/20 transition-all group">
                                Popular Battles
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>

                        {/* Live Comparison Selector Mock inside homepage (Advanced UX) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="w-full mt-12 p-2 rounded-2xl bg-bg-card/50 border border-border-color backdrop-blur-sm flex flex-col sm:flex-row items-center gap-2"
                        >
                            <button className="w-full sm:w-1/2 px-4 py-3 rounded-xl bg-bg-main border border-border-color text-left text-sm text-text-secondary hover:border-hyper-cyan/30 hover:text-text-primary transition-colors flex items-center justify-between group">
                                <span>Select Device 1...</span>
                                <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </button>
                            <div className="w-8 h-8 rounded-full bg-bg-main flex shrink-0 items-center justify-center text-xs font-bold text-text-secondary border border-border-color z-10 sm:-mx-6 my-2 sm:my-0 shadow-sm">
                                VS
                            </div>
                            <button className="w-full sm:w-1/2 px-4 py-3 rounded-xl bg-bg-main border border-border-color text-left text-sm text-text-secondary hover:border-hyper-cyan/30 hover:text-text-primary transition-colors flex items-center justify-between group">
                                <span>Select Device 2...</span>
                                <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </button>
                        </motion.div>
                    </div>

                    {/* RIGHT SIDE: VISUAL DEMO */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="relative z-10 w-full"
                    >
                        {/* Glow effect strictly behind the demo */}
                        <div className="absolute inset-0 bg-hyper-cyan/5 blur-3xl rounded-full scale-110 -z-10" />

                        <div className="rounded-[2.5rem] border border-border-color bg-bg-card/60 backdrop-blur-2xl shadow-premium-xl overflow-hidden">
                            {/* Device Headers */}
                            <div className="grid grid-cols-2 p-6 md:p-8 border-b border-border-color/50 relative">
                                {/* Center VS badge */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-bg-main border border-border-color flex items-center justify-center shadow-lg z-20">
                                    <Swords size={16} className="text-hyper-cyan" />
                                </div>

                                {/* Left Device */}
                                <motion.div 
                                    initial={{ x: -30, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                                    className="flex flex-col items-center text-center pr-6"
                                >
                                    <div className="w-20 h-24 mb-4 relative drop-shadow-xl">
                                        {/* Mock phone outline */}
                                        <div className="absolute inset-0 border-2 border-text-primary/20 rounded-2xl bg-linear-to-br from-bg-main to-bg-card" />
                                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-border-color" />
                                    </div>
                                    <p className="text-[10px] font-bold tracking-widest text-text-secondary uppercase mb-1">Apple</p>
                                    <h4 className="text-base font-semibold text-text-primary">iPhone 16 Pro</h4>
                                </motion.div>

                                {/* Right Device */}
                                <motion.div 
                                    initial={{ x: 30, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                                    className="flex flex-col items-center text-center pl-6"
                                >
                                    <div className="w-20 h-24 mb-4 relative drop-shadow-xl">
                                        <div className="absolute inset-0 border-2 border-text-primary/20 rounded-2xl bg-linear-to-br from-bg-main to-bg-card" />
                                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-border-color" />
                                    </div>
                                    <p className="text-[10px] font-bold tracking-widest text-text-secondary uppercase mb-1">Samsung</p>
                                    <h4 className="text-base font-semibold text-text-primary">Galaxy S24 Ultra</h4>
                                </motion.div>
                            </div>

                            {/* Comparison Rows */}
                            <div className="p-6 md:p-8 flex flex-col gap-6">
                                {MOCK_COMPARISON.map((row, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.4 + (i * 0.1) }}
                                        className="relative"
                                    >
                                        <div className="text-center text-xs font-semibold tracking-wider text-text-secondary uppercase mb-3 drop-shadow-sm">
                                            {row.label}
                                        </div>
                                        <div className="flex items-center justify-between bg-bg-main border border-border-color rounded-2xl p-2 relative overflow-hidden group">
                                            {/* Left Score */}
                                            <div className={`w-1/2 flex justify-center py-2 ${row.leftWins ? 'text-text-primary' : 'text-text-secondary opacity-50'}`}>
                                                <div className="flex items-center gap-2">
                                                    {row.leftWins && <Check size={14} className="text-hyper-cyan" />}
                                                    <span className="font-bold text-lg">{row.left}</span>
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="w-px h-8 bg-border-color/50 absolute left-1/2 -translate-x-1/2" />

                                            {/* Right Score */}
                                            <div className={`w-1/2 flex justify-center py-2 ${!row.leftWins ? 'text-text-primary' : 'text-text-secondary opacity-50'}`}>
                                                <div className="flex items-center gap-2">
                                                    {!row.leftWins && <Check size={14} className="text-hyper-cyan" />}
                                                    <span className="font-bold text-lg">{row.right}</span>
                                                </div>
                                            </div>

                                            {/* Subtle win highlight background */}
                                            <motion.div 
                                                initial={{ scaleX: 0 }}
                                                whileInView={{ scaleX: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.6, delay: 0.6 + (i * 0.1), ease: "easeOut" }}
                                                className={`absolute top-0 bottom-0 w-1/2 bg-hyper-cyan/5 -z-10 origin-${row.leftWins ? 'left' : 'right'} ${row.leftWins ? 'left-0' : 'right-0'}`}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            {/* Intelligent Insight / AI summary mock */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.9 }}
                                className="bg-hyper-cyan/5 border-t border-hyper-cyan/20 p-4 md:p-6 flex items-start gap-4"
                            >
                                <div className="w-8 h-8 rounded-full bg-hyper-cyan/20 flex shrink-0 items-center justify-center text-hyper-cyan mt-0.5">
                                    <Sparkles size={14} />
                                </div>
                                <div>
                                    <h5 className="text-sm font-semibold text-text-primary mb-1">Tech Nest Verdict</h5>
                                    <p className="text-xs text-text-primary/80 leading-relaxed">
                                        The <span className="font-medium">iPhone 16 Pro</span> edges out in raw computational tasks, but the <span className="font-medium">S24 Ultra</span> remains unmatched for camera versatility and productivity.
                                    </p>
                                </div>
                            </motion.div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
