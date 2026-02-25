export default function ArticleSkeleton() {
    return (
        <article className="group cursor-pointer flex flex-col gap-4">
            <div className="w-full aspect-video rounded-3xl bg-border-color/30 overflow-hidden relative animate-pulse shadow-md">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-text-primary/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
            
            <div className="flex flex-col gap-3 px-1">
                <div className="flex items-center gap-3 animate-pulse">
                    <div className="h-6 w-20 bg-hyper-cyan/20 rounded-md" />
                    <div className="w-1.5 h-1.5 rounded-full bg-border-color/50" />
                    <div className="h-4 w-24 bg-border-color/30 rounded-md" />
                </div>
                
                <div className="space-y-2 animate-pulse mt-1">
                    <div className="h-8 w-full bg-text-primary/10 rounded-lg" />
                    <div className="h-8 w-4/5 bg-text-primary/10 rounded-lg" />
                </div>
                
                <div className="h-4 w-2/3 bg-text-secondary/10 rounded-md animate-pulse mt-2" />
            </div>
        </article>
    );
}
