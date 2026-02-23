import { useState } from "react";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export default function MediaGallery({ device }) {
    // In future this will be from device.device_media
    const images = [
        device?.image_url || "/placeholder-device.png",
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1592899677974-e50f38ebce1b?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1610945265064-3e9114f08960?auto=format&fit=crop&q=80&w=800"
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    return (
        <section className="mb-24">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Media Gallery</h2>
                <button 
                    onClick={() => setIsFullscreen(true)}
                    className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-widest hover:text-hyper-cyan transition-colors"
                >
                    <Maximize2 size={16} /> View Fullscreen
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 h-auto md:h-[500px]">
                {/* Main Large Image */}
                <div className="md:col-span-3 bg-bg-card border border-border-color rounded-3xl p-8 flex items-center justify-center relative group overflow-hidden">
                    <img 
                        src={images[activeIndex]} 
                        alt="Device Angle" 
                        className="max-h-[80%] object-contain drop-shadow-2xl transition-transform duration-700 ease-spring group-hover:scale-105" 
                    />
                </div>

                {/* Thumbnails */}
                <div className="flex flex-row md:flex-col gap-4 md:gap-6 overflow-x-auto md:overflow-y-auto no-scrollbar">
                    {images.map((img, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={twMerge(
                                clsx(
                                    "shrink-0 w-24 md:w-full h-24 md:h-1/4 bg-bg-card border rounded-2xl p-2 flex items-center justify-center transition-all duration-300",
                                    activeIndex === idx 
                                        ? "border-text-primary ring-1 ring-text-primary scale-[0.98]" 
                                        : "border-border-color hover:border-text-secondary/50 opacity-60 hover:opacity-100"
                                )
                            )}
                        >
                            <img src={img} alt={`Thumb ${idx}`} className="h-full object-contain" />
                        </button>
                    ))}
                </div>
            </div>

            {/* FULLSCREEN MODAL */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-black/98 backdrop-blur-xl flex flex-col pt-8 pb-12 animate-in fade-in duration-300">
                    <div className="absolute top-8 right-8 z-50">
                        <button 
                            onClick={() => setIsFullscreen(false)} 
                            className="bg-bg-card/20 hover:bg-bg-card/40 text-white rounded-full p-4 backdrop-blur-md transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-center relative w-full h-full max-w-7xl mx-auto px-4">
                        <button 
                            onClick={() => setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                            className="absolute left-4 md:left-12 bg-bg-card/20 hover:bg-bg-card/40 text-white rounded-full p-4 backdrop-blur-md transition-colors"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        
                        <img 
                            src={images[activeIndex]} 
                            alt="Fullscreen View" 
                            className="max-w-full max-h-full object-contain drop-shadow-2xl pointer-events-none" 
                        />

                        <button 
                            onClick={() => setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                            className="absolute right-4 md:right-12 bg-bg-card/20 hover:bg-bg-card/40 text-white rounded-full p-4 backdrop-blur-md transition-colors"
                        >
                            <ChevronRight size={32} />
                        </button>
                    </div>
                    
                    <div className="flex justify-center gap-3 mt-8">
                        {images.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={twMerge(
                                    clsx(
                                        "h-1.5 rounded-full transition-all duration-300",
                                        activeIndex === idx ? "w-8 bg-white" : "w-2 bg-white/30"
                                    )
                                )}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
