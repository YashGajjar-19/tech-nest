import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function StatCard ( { icon, value, suffix, label, delay = 0 } )
{
    return (
        <motion.div
            initial={ { opacity: 0, y: 30 } }
            whileInView={ { opacity: 1, y: 0 } }
            viewport={ { once: true, margin: "-50px" } }
            transition={ { duration: 0.6, delay, ease: "easeOut" } }
            className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-2xl text-center hover:bg-white/10 transition-colors duration-300 relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-linear-to-br from-hyper-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

            <div className="text-3xl mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-500 will-change-transform">
                { icon }
            </div>

            <div className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white flex items-center justify-center">
                <CountUp
                    end={ value }
                    duration={ 2.5 }
                    separator=","
                    enableScrollSpy={ true }
                    scrollSpyOnce={ true }
                    scrollSpyDelay={ delay * 1000 }
                />
                <span className="text-hyper-cyan ml-1">{ suffix }</span>
            </div>

            <p className="text-sm md:text-base font-medium text-white/50 tracking-wider uppercase mt-1">
                { label }
            </p>
        </motion.div>
    );
}
