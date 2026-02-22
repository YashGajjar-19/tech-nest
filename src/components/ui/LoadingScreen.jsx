import { motion } from "framer-motion";
import Logo from "@/components/shared/Logo";

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-main text-text-primary">
            {/* AMBIENT BACKGROUND GLOW */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [0.8, 1.1, 0.8]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"
            />

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* LOGO */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Logo size={60} />
                </motion.div>

                {/* VISUAL LOADING INDICATOR (Minimal) */}
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-1 bg-border-color rounded-full overflow-hidden">
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="w-full h-full bg-cyan-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}