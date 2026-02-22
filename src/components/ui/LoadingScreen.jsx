import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export default function LoadingScreen ( { message = "INITIALIZING_SYSTEM" } )
{
    return (
        <div className="fixed inset-0 z-100 bg-bg-main flex flex-col items-center justify-center font-mono transition-colors duration-500">
            {/* Background Glow */ }
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-hyper-cyan/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative flex flex-col items-center">
                {/* Circular Loader */ }
                <div className="relative w-24 h-24 mb-10">
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-border-color"
                        animate={ { opacity: [ 0.3, 0.6, 0.3 ] } }
                        transition={ { duration: 2, repeat: Infinity, ease: "easeInOut" } }
                    />
                    <motion.div
                        className="absolute inset-0 rounded-full border-t-2 border-hyper-cyan"
                        animate={ { rotate: 360 } }
                        transition={ { duration: 1.5, repeat: Infinity, ease: "linear" } }
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Terminal size={ 24 } className="text-hyper-cyan opacity-80" />
                    </div>
                </div>

                {/* Text Elements */ }
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-hyper-cyan"
                            animate={ { opacity: [ 0, 1, 0 ] } }
                            transition={ { duration: 1, repeat: Infinity } }
                        />
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] text-text-primary">
                            { message }
                        </span>
                    </div>

                    <div className="flex gap-1">
                        { [ 0, 1, 2 ].map( ( i ) => (
                            <motion.div
                                key={ i }
                                className="w-8 h-1 rounded-full bg-border-color overflow-hidden"
                            >
                                <motion.div
                                    className="h-full bg-hyper-cyan/30"
                                    initial={ { x: "-100%" } }
                                    animate={ { x: "100%" } }
                                    transition={ {
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: "easeInOut"
                                    } }
                                />
                            </motion.div>
                        ) ) }
                    </div>
                </div>
            </div>

            {/* Bottom Tech Text */ }
            <div className="absolute bottom-10 left-10 hidden sm:block">
                <div className="text-[9px] opacity-30 uppercase tracking-[0.3em]">
                    Kernel_Ver: 5.10.0-TN-OS<br />
                    System_Status: Optimal
                </div>
            </div>
        </div>
    );
}
