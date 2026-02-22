import { motion } from "framer-motion";

export default function HeroHeadline ()
{
    return (
        <div className="flex flex-col items-center mb-8">
            <motion.h1
                initial={ { opacity: 0, y: 30 } }
                animate={ { opacity: 1, y: 0 } }
                transition={ { duration: 0.8, delay: 0.1, ease: [ 0.16, 1, 0.3, 1 ] } }
                className="text-5xl sm:text-6xl md:text-[72px] font-semibold tracking-tight text-text-primary leading-[1.05] max-w-[700px] mb-6"
            >
                The Intelligent Way to Discover Tech.
            </motion.h1>
        </div>
    );
}
