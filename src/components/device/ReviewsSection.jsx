import { Star, CheckCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ReviewsSection() {
    return (
        <section className="mb-24">
            <h2 className="text-2xl font-bold mb-8 text-text-primary uppercase tracking-tight">Tech Nest Reviews</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Expert Review (1 column on large screens) */}
                <div className="bg-bg-card border border-hyper-cyan/30 rounded-3xl p-8 lg:col-span-1 flex flex-col justify-between group">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="bg-text-primary text-bg-main text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full">
                                Editor's Choice
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={18} fill="currentColor" />
                            ))}
                        </div>
                        <blockquote className="text-xl font-medium text-text-primary leading-tight mb-6">
                            "A masterclass in modern hardware. The standard 2024 smartphone."
                        </blockquote>
                        <p className="text-sm text-text-secondary leading-relaxed mb-6">
                            This device redefines what we expect from a flagship. It perfectly balances raw horsepower with software elegance. The camera system alone places it in a league of its own, outperforming nearly every competitor in low-light and video stability.
                        </p>
                    </div>
                </div>

                {/* User Reviews (2 columns on large screens) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-text-primary uppercase tracking-tight">Community Sentiment</h3>
                        <Button variant="outline" className="text-xs py-1.5 h-auto pointer-events-none">Leave Review</Button>
                    </div>

                    {/* Review Item */}
                    <div className="bg-bg-card border border-border-color rounded-2xl p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-text-primary text-sm">Alex D.</span>
                                    <span className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded-full">
                                        <CheckCircle size={10} /> Verified
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500 mt-1">
                                    {[...Array(4)].map((_, i) => (
                                        <Star key={i} size={12} fill="currentColor" />
                                    ))}
                                    <Star size={12} className="text-border-color" fill="currentColor" />
                                </div>
                            </div>
                            <span className="text-xs text-text-secondary">2 days ago</span>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed mb-4">
                            Battery life is phenomenal. I'm a heavy user and it easily lasts me 1.5 days. The UI is snappy, but I do wish the charging speed was a bit faster compared to others in this range.
                        </p>
                        <div className="flex gap-4">
                            <div className="flex items-start gap-2 text-xs">
                                <ThumbsUp size={14} className="text-green-500 shrink-0 mt-0.5" />
                                <span className="text-text-primary">Incredible battery, smooth OS</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs">
                                <ThumbsDown size={14} className="text-red-500 shrink-0 mt-0.5" />
                                <span className="text-text-primary">Average charging</span>
                            </div>
                        </div>
                    </div>

                    {/* Review Item */}
                    <div className="bg-bg-card border border-border-color rounded-2xl p-6 opacity-60">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-text-primary text-sm">TechEnthusiast99</span>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} fill="currentColor" />
                                    ))}
                                </div>
                            </div>
                            <span className="text-xs text-text-secondary">1 week ago</span>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed mb-4">
                            Honestly the best screen I've ever seen. The anti-reflective coating is a game changer for outdoor use.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
