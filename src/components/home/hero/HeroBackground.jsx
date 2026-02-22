import { motion } from "framer-motion";

export default function HeroBackground() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* LAYER 1: Base is implicitly handled by bg-bg-main on the section */}

            {/* LAYER 2: The Core Glow (Centered) */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.15, 0.25, 0.15] 
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] md:w-[1200px] h-[600px] bg-hyper-cyan blur-[250px] rounded-[100%] pointer-events-none opacity-20"
                style={{ transformOrigin: "center top" }}
            />

            {/* LAYER 3: Subtle Dot Grid Overlay */}
            <div 
                className="absolute inset-0 z-0 opacity-[0.03]" 
                style={{ 
                    backgroundImage: 'radial-gradient(circle at 2px 2px, var(--text-primary) 1px, transparent 0)', 
                    backgroundSize: '32px 32px',
                    maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)'
                }} 
            />
            
            {/* Masking Fade at the bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-main/80 to-bg-main" />
        </div>
    );
}
