import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-100 bg-bg-main flex flex-col items-center justify-center transition-colors duration-500">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-hyper-cyan/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative flex flex-col items-center justify-center">
                {/* Pulsating backglow for the logo */}
                <motion.div
                    className="absolute inset-[-50%] rounded-full bg-hyper-cyan/10 blur-2xl"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Tech Nest Logo */}
                <div className="relative z-10">
                    <Logo size={48} className="text-text-primary" />
                </div>

                {/* Sleek Progress Indicator */}
                <motion.div
                    className="absolute -bottom-10 w-full flex justify-center"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <div className="w-24 h-[2px] bg-border-color rounded-full overflow-hidden relative">
                        <motion.div
                            className="absolute top-0 bottom-0 left-0 bg-text-primary rounded-full w-1/3"
                            animate={{ x: ["-100%", "300%"] }}
                            transition={{ 
                                duration: 1.5, 
                                repeat: Infinity, 
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                </motion.div>
                
                {/* Optional subtle text */}
                <motion.div
                    className="absolute -bottom-16 text-[10px] font-semibold tracking-[0.2em] text-text-secondary uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ delay: 0.5, duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    Loading Environment
                </motion.div>
            </div>
        </div>
    );
}
