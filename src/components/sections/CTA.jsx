import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTA() {
    return (
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-bg-main">
            
            {/* Background elements with animation */}
            <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="w-full h-full bg-linear-to-r from-indigo-500/20 to-blue-500/20 rounded-3xl blur-md absolute inset-0 -z-10"
                    style={{
                        animation: "pulse-slow 8s infinite alternate"
                    }}
                />
            </div>

            <div className="max-w-4xl mx-auto relative z-10 text-center py-16 md:py-28 px-4 sm:px-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden text-white/90 shadow-2xl">
                
                {/* Subtle Grid overlay for texture */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[24px_24px] opacity-70 mix-blend-overlay pointer-events-none" />

                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white"
                >
                    Ready to Explore <span className="text-transparent bg-clip-text bg-linear-to-r from-hyper-cyan to-blue-400">Smarter Tech?</span>
                </motion.h2>
                
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-lg md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    Compare devices, read trusted reviews, and discover technology with intelligence.
                </motion.p>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                >
                    <Link to="/products" className="relative group overflow-hidden w-full sm:w-auto">
                        <div className="absolute inset-0 bg-linear-to-r from-hyper-cyan to-blue-500 opacity-80 group-hover:opacity-100 transition-opacity blur-md" />
                        <div className="relative px-8 py-4 bg-linear-to-r from-hyper-cyan to-blue-500 text-black font-bold rounded-full overflow-hidden transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(0,255,204,0.4)] flex items-center justify-center">
                            Explore Devices
                        </div>
                    </Link>
                    
                    <Link to="/compare" className="group px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full border border-white/20 transition-all duration-300 flex items-center justify-center gap-2 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] w-full sm:w-auto">
                        Start Comparing <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

            </div>
            
            <style jsx="true">{`
                @keyframes pulse-slow {
                    0% { transform: scale(0.98); opacity: 0.7; }
                    100% { transform: scale(1.02); opacity: 1; }
                }
            `}</style>
        </section>
    );
}
