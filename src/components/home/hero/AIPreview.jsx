import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function AIPreview ()
{
    return (
        <motion.div
            initial={ { opacity: 0, y: 40, scale: 0.95 } }
            animate={ { opacity: 1, y: 0, scale: 1 } }
            transition={ { duration: 1, delay: 0.5, ease: [ 0.16, 1, 0.3, 1 ] } }
            className="w-full max-w-xl mx-auto rounded-[2.5rem] bg-gradient-to-b from-bg-card/80 to-bg-main/50 backdrop-blur-3xl border border-border-color p-1 overflow-hidden shadow-premium-xl group"
        >
            <div className="bg-bg-card/40 rounded-[2.3rem] p-6 lg:p-8 flex flex-col items-start text-left border border-border-color/30 group-hover:bg-bg-card/60 transition-colors duration-500">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-hyper-cyan/10 flex items-center justify-center border border-hyper-cyan/20">
                        <Sparkles size={ 14 } className="text-hyper-cyan" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary opacity-60">Tech Nest AI Suggests</span>
                </div>

                <h4 className="text-lg md:text-xl font-semibold text-text-primary mb-6">Best Camera Phone Under ₹50K</h4>

                <div className="space-y-3 w-full">
                    {/* Simulating 3 results */ }
                    <ResultRow title="Pixel 8 Pro" match="95%" active />
                    <ResultRow title="Xiaomi 14" match="88%" />
                    <ResultRow title="iQOO 12" match="82%" />
                </div>
            </div>
        </motion.div>
    );
}

function ResultRow ( { title, match, active } )
{
    return (
        <div className={ `flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${ active
                ? 'bg-bg-main border-hyper-cyan/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                : 'bg-bg-main/50 border-border-color hover:border-text-primary/20 hover:bg-bg-main'
            }` }>
            <div className="flex items-center gap-4">
                <span className={ `text-sm md:text-base font-medium ${ active ? 'text-hyper-cyan' : 'text-text-secondary' }` }>
                    → { title }
                </span>
            </div>
            <div className="flex items-center gap-4">
                <span className={ `text-[10px] font-mono uppercase tracking-widest ${ active ? 'text-hyper-cyan' : 'text-text-secondary opacity-50' }` }>
                    { match } Match
                </span>
                <ArrowRight size={ 16 } className={ `${ active ? 'text-hyper-cyan' : 'text-text-secondary opacity-20 group-hover:opacity-100' } transition-opacity` } />
            </div>
        </div>
    );
}
