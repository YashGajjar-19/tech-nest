export default function CardSkeleton() {
    return (
        <div className="bg-bg-card border border-border-color rounded-3xl p-5 overflow-hidden shadow-premium hover:shadow-premium-xl transition-all duration-300">
            {/* Image Placeholder */}
            <div className="relative aspect-square w-full bg-border-color/30 rounded-2xl mb-5 overflow-hidden animate-pulse">
                {/* Optional shimmer effect using global styling or just pulse class */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-text-primary/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>

            {/* Title & Brand */}
            <div className="flex justify-between items-start mb-4">
                <div className="w-2/3">
                    <div className="h-4 bg-border-color/40 rounded-full w-20 mb-2 animate-pulse" />
                    <div className="h-6 bg-border-color/50 rounded-full w-full animate-pulse" />
                </div>
                <div className="w-10 h-10 bg-border-color/40 rounded-xl animate-pulse" />
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="h-10 bg-border-color/20 rounded-xl w-full animate-pulse" />
                <div className="h-10 bg-border-color/20 rounded-xl w-full animate-pulse" />
            </div>

            {/* Button */}
            <div className="h-12 bg-border-color/30 rounded-xl w-full mt-auto animate-pulse" />
        </div>
    );
}
