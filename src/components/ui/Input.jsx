import { cn } from "@/lib/utils";

export default function Input({ label, icon: Icon, error, className, ...props }) {
    return (
        <div className="space-y-2 group w-full">
            {label && (
                <label className="text-[9px] font-mono text-text-secondary uppercase tracking-[0.2em] ml-2 group-focus-within:text-cyan-500 transition-colors">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-cyan-500 transition-colors"
                    />
                )}
                <input
                    className={cn(
                        "w-full bg-bg-card border border-border-color rounded-xl py-3.5 pr-4 text-xs font-mono text-text-primary placeholder:text-text-secondary focus:border-cyan-500/50 focus:bg-bg-main/50 outline-none transition-all",
                        Icon ? "pl-12" : "pl-4",
                        error ? "border-red-500/50" : "",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-red-500 text-[9px] font-mono ml-2">{error}</p>}
        </div>
    );
}