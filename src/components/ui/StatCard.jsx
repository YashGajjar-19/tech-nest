import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function StatCard ( { icon: Icon, value, suffix, label, delay = 0 } )
{
    return (
        <motion.div
            initial={ { opacity: 0, y: 30 } }
            whileInView={ { opacity: 1, y: 0 } }
            viewport={ { once: true, margin: "-50px" } }
            transition={ { duration: 0.8, delay, ease: [ 0.16, 1, 0.3, 1 ] } }
            className="flex flex-col items-center justify-center p-8 bg-bg-card/40 backdrop-blur-md border border-border-color rounded-3xl text-center group relative overflow-hidden transition-all duration-500 hover:border-hyper-cyan/30 hover:shadow-premium-xl active:scale-95"
        >
            {/* Hover Shine Effect */ }
            <div className="absolute inset-0 bg-linear-to-br from-hyper-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="w-12 h-12 rounded-2xl bg-bg-main border border-border-color flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-hyper-cyan/10 group-hover:border-hyper-cyan/20 transition-all duration-500 group-hover:rotate-6">
                <Icon size={ 22 } className="text-text-secondary group-hover:text-hyper-cyan transition-colors duration-500" />
            </div>

            <div className="text-4xl md:text-5xl font-black tracking-tighter text-text-primary flex items-baseline justify-center mb-2">
                <CountUp
                    end={ value }
                    duration={ 3 }
                    separator=","
                    enableScrollSpy={ true }
                    scrollSpyOnce={ true }
                    scrollSpyDelay={ delay * 1000 }
                />
                <span className="text-hyper-cyan font-bold italic ml-0.5">{ suffix }</span>
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-text-secondary opacity-60 group-hover:opacity-100 group-hover:text-text-primary transition-all duration-500">
                { label }
            </p>
        </motion.div>
    );
}
