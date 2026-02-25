export default function DeviceSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 mt-10">
            {/* Header / Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6 animate-pulse">
                <div className="w-24 h-8 bg-border-color/30 rounded-full" />
                <div className="w-32 h-8 bg-border-color/30 rounded-full" />
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
                {/* Left: Device Images Skeleton */}
                <div className="sticky top-32 space-y-6">
                    <div className="w-full aspect-4/5 bg-border-color/20 rounded-3xl flex items-center justify-center animate-pulse overflow-hidden relative">
                        <div className="w-1/2 h-[80%] bg-border-color/30 rounded-full opacity-50 shadow-inner blur-3xl absolute" />
                    </div>
                    {/* Thumbnails */}
                    <div className="flex w-full gap-4 overflow-x-auto pb-4 no-scrollbar">
                        <div className="w-20 h-20 bg-border-color/20 rounded-2xl shrink-0 animate-pulse" />
                        <div className="w-20 h-20 bg-border-color/20 rounded-2xl shrink-0 animate-pulse" />
                        <div className="w-20 h-20 bg-border-color/20 rounded-2xl shrink-0 animate-pulse" />
                    </div>
                </div>

                {/* Right: Device Specs Skeleton */}
                <div className="flex flex-col gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="w-40 h-8 bg-border-color/30 rounded-lg animate-pulse" />
                        </div>
                        <div className="w-3/4 h-14 bg-border-color/40 rounded-xl animate-pulse" />
                        <div className="w-full h-24 bg-border-color/20 rounded-xl animate-pulse" />
                    </div>

                    {/* Key Features Block */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(idx => (
                            <div key={idx} className="bg-bg-card border border-border-color rounded-2xl p-4 flex flex-col items-center gap-3 animate-pulse">
                                <div className="w-10 h-10 bg-border-color/40 rounded-full" />
                                <div className="w-16 h-4 bg-border-color/30 rounded-lg" />
                                <div className="w-full h-6 bg-border-color/40 rounded-lg" />
                            </div>
                        ))}
                    </div>

                    {/* Pricing Block */}
                    <div className="bg-hyper-cyan/5 border border-hyper-cyan/20 rounded-3xl p-6 sm:p-8 space-y-6 animate-pulse">
                        <div className="w-32 h-6 bg-hyper-cyan/20 rounded-lg" />
                        <div className="flex items-baseline gap-4">
                            <div className="w-48 h-16 bg-hyper-cyan/30 rounded-xl" />
                        </div>
                        <div className="w-full h-14 bg-hyper-cyan/40 rounded-2xl mt-4" />
                    </div>

                    {/* Tabs / Detailed Specs */}
                    <div className="space-y-4 pt-10 border-t border-border-color">
                        <div className="flex gap-4">
                            <div className="w-24 h-10 bg-border-color/30 rounded-full animate-pulse" />
                            <div className="w-24 h-10 bg-border-color/30 rounded-full animate-pulse" />
                            <div className="w-24 h-10 bg-border-color/30 rounded-full animate-pulse" />
                        </div>
                        <div className="h-40 bg-border-color/20 rounded-2xl w-full animate-pulse mt-6" />
                        <div className="h-40 bg-border-color/20 rounded-2xl w-full animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}
