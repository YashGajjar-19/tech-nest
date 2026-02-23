import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BrainCircuit, ArrowRight, Bot, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { TypeAnimation } from "react-type-animation";

export default function AIPreview() {
    const [step, setStep] = useState(0);
    const [hasTriggered, setHasTriggered] = useState(false);

    // Dummy answers
    const RECOMMENDATIONS = [
        { name: "iQOO Neo 9 Pro", spec: "Snapdragon 8 Gen 2 • Flagship Killer" },
        { name: "OnePlus 12R", spec: "5500mAh Battery • LTPO 4.0 Display" },
        { name: "Realme GT 6", spec: "120W Fast Charge • Ultra Bright AMOLED" },
    ];

    return (
        <section 
            id="ai-layout"
            className="relative py-24 md:py-32 overflow-hidden bg-bg-main"
        >
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
                <div className="w-[1000px] h-[1000px] bg-hyper-cyan/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/4" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    
                    {/* LEFT: CONTENT */}
                    <div className="flex flex-col items-start text-left relative z-10 max-w-xl mx-auto lg:mx-0">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-hyper-cyan/10 border border-hyper-cyan/20 text-hyper-cyan text-sm font-medium mb-6"
                        >
                            <Sparkles size={14} />
                            <span>Meet Tech Nest AI</span>
                        </motion.div>

                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-text-primary mb-6 leading-[1.1]"
                            id="gqtrgm"
                        >
                            Ask. Compare. <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-hyper-cyan to-white/70">Decide Smarter.</span>
                        </motion.h2>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg text-text-secondary leading-relaxed mb-10"
                            id="c7zkwg"
                        >
                            Tech Nest AI analyzes specifications, performance, and trends to recommend the best devices instantly. Skip the endless research.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
                        >
                            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-text-primary text-bg-main text-sm font-semibold hover:scale-105 hover:shadow-premium-xl transition-all duration-300 ease-spring">
                                <BrainCircuit size={16} />
                                Try AI Free
                            </button>
                            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-bg-card border border-border-color text-text-primary text-sm font-medium hover:bg-bg-main transition-colors group">
                                Learn More
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>

                    {/* RIGHT: LIVE AI UI PREVIEW */}
                    <motion.div
                        onViewportEnter={() => setHasTriggered(true)}
                        className="relative z-10 w-full max-w-lg mx-auto lg:max-w-none"
                    >
                        {/* Decorative floating elements */}
                        <motion.div 
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 sm:-top-10 sm:-right-10 w-20 h-20 sm:w-28 sm:h-28 bg-linear-to-br from-hyper-cyan/20 to-transparent rounded-full blur-2xl z-0"
                        />

                        {/* Main Chat Interface */}
                        <div className="relative rounded-4xl border border-border-color bg-bg-card/40 backdrop-blur-3xl shadow-premium-xl overflow-hidden flex flex-col h-[400px] sm:h-[450px]">
                            {/* Window Header */}
                            <div className="px-6 py-4 border-b border-border-color/50 flex items-center justify-between bg-bg-main/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-hyper-cyan/10 flex items-center justify-center text-hyper-cyan">
                                        <Bot size={16} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-text-primary">Tech Nest Intelligence</h3>
                                        <p className="text-[11px] text-text-secondary">Always active</p>
                                    </div>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-border-color border border-text-secondary/10" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-border-color border border-text-secondary/10" />
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 p-5 sm:p-6 flex flex-col gap-5 sm:gap-6 overflow-hidden">
                                {/* Initial Prompt hint */}
                                <div className="text-center text-xs text-text-secondary/50 font-medium tracking-wider uppercase">
                                    System Initialized
                                </div>

                                {/* User bubbles */}
                                <AnimatePresence>
                                    {hasTriggered && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, originX: 1, originY: 1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="self-end max-w-[85%] sm:max-w-[80%]"
                                        >
                                            <div className="bg-text-primary text-bg-main px-4 py-3 rounded-2xl rounded-tr-sm text-sm font-medium shadow-md">
                                                <TypeAnimation
                                                    sequence={[
                                                        1500, // delay initially
                                                        'Best gaming phone under ₹40,000?',
                                                        500,  // wait a bit
                                                        () => setStep(1) // trigger next state
                                                    ]}
                                                    wrapper="span"
                                                    cursor={true}
                                                    repeat={0}
                                                    speed={50}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* AI Response bubbles */}
                                {step >= 1 && (
                                    <div className="flex items-start gap-3 w-full">
                                        <div className="w-8 h-8 rounded-full bg-hyper-cyan/10 shrink-0 flex items-center justify-center text-hyper-cyan mt-1">
                                            <Sparkles size={14} />
                                        </div>
                                        <div className="flex flex-col gap-3 w-full">
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-bg-main border border-border-color text-text-primary px-4 py-3 rounded-2xl rounded-tl-sm text-sm shadow-sm"
                                            >
                                                {step === 1 ? (
                                                    <div className="flex items-center gap-2 text-text-secondary font-medium">
                                                        <TypeAnimation
                                                            sequence={[
                                                                'Analyzing benchmarks and performance...',
                                                                1500,
                                                                () => setStep(2)
                                                            ]}
                                                            wrapper="span"
                                                            cursor={true}
                                                            repeat={0}
                                                            speed={70}
                                                        />
                                                    </div>
                                                ) : (
                                                    <p className="leading-relaxed">Based on sustained thermal performance and raw AnTuTu scores, here are the top picks right now:</p>
                                                )}
                                            </motion.div>

                                            {/* Results Grid */}
                                            {step >= 2 && (
                                                <div className="flex flex-col gap-2 w-full mt-1">
                                                    {RECOMMENDATIONS.map((rec, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.4 }}
                                                            className="flex items-center justify-between p-3 rounded-xl bg-bg-main border border-border-color hover:border-hyper-cyan/30 hover:bg-hyper-cyan/5 transition-colors cursor-pointer group shadow-sm"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-6 h-6 rounded-full bg-bg-card border border-border-color flex items-center justify-center text-hyper-cyan opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all">
                                                                    <CheckCircle2 size={12} strokeWidth={2.5}/>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-text-primary group-hover:text-hyper-cyan transition-colors">{rec.name}</p>
                                                                    <p className="text-[11px] text-text-secondary">{rec.spec}</p>
                                                                </div>
                                                            </div>
                                                            <ChevronRight size={14} className="text-text-secondary opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all group-hover:text-hyper-cyan" />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Fake Input Area */}
                            <div className="p-4 border-t border-border-color/50 bg-bg-main/50 relative">
                                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-hyper-cyan/20 to-transparent" />
                                <div className="relative bg-bg-card border border-border-color rounded-xl px-4 py-3 flex items-center justify-between shadow-inner">
                                    <span className="text-sm text-text-secondary opacity-50">Ask anything...</span>
                                    <div className="w-8 h-8 rounded-lg bg-text-primary flex items-center justify-center text-bg-main opacity-50">
                                        <Zap size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
