import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-bg-main text-text-primary flex flex-col items-center justify-center text-center p-6 font-mono transition-colors duration-500">

            {/* ERROR CODE */}
            <h1 className="text-[150px] font-black leading-none text-border-color select-none">
                404
            </h1>

            <div className="relative -mt-12 bg-bg-card border border-border-color p-8 rounded-3xl shadow-2xl max-w-md w-full">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                    <AlertTriangle size={24} />
                </div>

                <h2 className="text-2xl font-bold uppercase mb-2">Signal_Lost</h2>
                <p className="text-xs opacity-60 mb-8 leading-relaxed">
                    The requested neural pathway does not exist. The unit may have been decommissioned or the URL is corrupted.
                </p>

                <Link
                    to="/"
                    className="block w-full py-4 rounded-xl bg-text-primary text-bg-main font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <span className="flex items-center justify-center gap-2">
                        <ArrowLeft size={14} /> Return_to_Base
                    </span>
                </Link>
            </div>

            <div className="mt-12 text-[10px] opacity-30 uppercase tracking-widest">
                Error_Code: PROTOCOL_MISSING
            </div>
        </div>
    );
}