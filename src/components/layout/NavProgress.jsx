import { useEffect, useState } from "react";
import { useNavigation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function NavProgress() {
    const navigation = useNavigation();
    const [progress, setProgress] = useState(0);

    const isNavigating = navigation.state === "loading";

    useEffect(() => {
        let interval;
        if (isNavigating) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress((oldProgress) => {
                    const newProgress = oldProgress + (100 - oldProgress) * 0.1;
                    return newProgress > 95 ? 95 : newProgress;
                });
            }, 100);
        } else {
            setProgress(100);
            const timeout = setTimeout(() => {
                setProgress(0);
            }, 300); // Hide after animation
            if (interval) clearInterval(interval);
            return () => clearTimeout(timeout);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isNavigating]);

    return (
        <AnimatePresence>
            {isNavigating || progress === 100 || progress > 0 ? (
                <div className="fixed top-0 left-0 right-0 h-1 z-[9999] pointer-events-none overflow-hidden bg-transparent">
                    <motion.div
                        className="h-full bg-hyper-cyan shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                        initial={{ width: "0%", opacity: 1 }}
                        animate={{ 
                            width: `${progress}%`, 
                            opacity: progress === 100 ? 0 : 1 
                        }}
                        transition={{ ease: "easeOut", duration: 0.15 }}
                        exit={{ opacity: 0 }}
                    />
                </div>
            ) : null}
        </AnimatePresence>
    );
}
