import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Target } from "lucide-react";

export default function CTA() {
    return (
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-bg-main" id="final-cta">
            
            <div className="max-w-7xl mx-auto">
                <div className="relative rounded-[3rem] border border-border-color bg-bg-card/40 backdrop-blur-3xl overflow-hidden p-8 md:p-16 lg:p-24 shadow-premium-xl group">
                    
                    {/* Background Decorative Elements */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[32px_32px]" />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-hyper-cyan/5 to-transparent pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-hyper-cyan/10 blur-[100px] rounded-full group-hover:bg-hyper-cyan/15 transition-colors duration-700" />

                    <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="w-14 h-14 rounded-2xl bg-bg-main border border-border-color flex items-center justify-center mb-10 shadow-inner group-hover:rotate-360 transition-transform duration-1000"
                        >
                            <Zap size={24} className="text-hyper-cyan" />
                        </motion.div>

                        <motion.h2 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter text-text-primary mb-8"
                        >
                            Elevate Your <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-hyper-cyan to-text-primary/70">Hardware Game</span>
                        </motion.h2>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className="text-lg md:text-xl text-text-secondary mb-12 max-w-xl opacity-80 leading-relaxed font-medium"
                        >
                            Stop guessing. Start comparing. Discover the technology that perfectly synchronizes with your lifestyle.
                        </motion.p>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
                        >
                            <Link 
                                to="/" 
                                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-text-primary text-bg-main rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 hover:shadow-premium-xl transition-all duration-300 ease-spring"
                            >
                                <Target size={16} />
                                Explore Registry
                            </Link>
                            
                            <Link 
                                to="/battle" 
                                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-bg-main border border-border-color text-text-primary rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-bg-card hover:border-hyper-cyan/30 transition-all duration-300 group"
                            >
                                Enter Battle
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-hyper-cyan/20 rounded-tl-[3rem] pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
