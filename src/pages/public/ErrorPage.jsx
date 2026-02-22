import { useRouteError, Link } from "react-router-dom";
import { AlertOctagon, RefreshCw, Home } from "lucide-react";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="min-h-screen bg-bg-main text-text-primary flex flex-col items-center justify-center text-center p-6 font-mono transition-colors duration-500">
            
            <h1 className="text-[120px] font-black leading-none text-red-500/10 select-none">
                ERR
            </h1>

            <div className="relative -mt-10 bg-bg-card border border-border-color p-8 rounded-3xl shadow-2xl max-w-md w-full backdrop-blur-xl">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-500/20">
                    <AlertOctagon size={24} />
                </div>

                <h2 className="text-xl font-bold uppercase mb-2">System_Failure</h2>
                
                <p className="text-xs opacity-60 mb-6 font-mono">
                    {error.statusText || error.message || "An unexpected error occurred."}
                </p>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full py-3 rounded-xl bg-bg-main border border-border-color hover:border-cyan-500/50 hover:text-cyan-500 text-text-secondary font-bold uppercase tracking-wider text-[10px] transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={14} /> Reboot_System
                    </button>
                    
                    <Link
                        to="/"
                        className="w-full py-3 rounded-xl bg-text-primary text-bg-main font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <Home size={14} /> Return_to_Base
                    </Link>
                </div>
            </div>

            <div className="mt-12 text-[10px] opacity-30 uppercase tracking-widest font-mono">
                Error_Code: SYSTEM_CRASH
            </div>
        </div>
    );
}
