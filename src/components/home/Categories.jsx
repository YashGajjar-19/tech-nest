import { Smartphone, Laptop, Tablet, Watch, Headphones, Tv } from "lucide-react";
import CategoryCard from "../ui/CategoryCard";

const CATEGORIES_DATA = [
    {
        title: "Phones",
        subtitle: "Latest smartphones & specs",
        icon: <Smartphone size={24} strokeWidth={1.5} />,
    },
    {
        title: "Laptops",
        subtitle: "Pro machines & ultrabooks",
        icon: <Laptop size={24} strokeWidth={1.5} />,
    },
    {
        title: "Tablets",
        subtitle: "Pads & creative displays",
        icon: <Tablet size={24} strokeWidth={1.5} />,
    },
    {
        title: "Smart Watches",
        subtitle: "Fitness & wearables",
        icon: <Watch size={24} strokeWidth={1.5} />,
    },
    {
        title: "Earbuds",
        subtitle: "TWS & reference audio",
        icon: <Headphones size={24} strokeWidth={1.5} />,
    },
    {
        title: "Smart TVs",
        subtitle: "OLED & premium panels",
        icon: <Tv size={24} strokeWidth={1.5} />,
    }
];

export default function Categories() {
    return (
        <section className="py-24 md:py-32 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left mb-16">
                <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-text-primary mb-4">
                    Explore Devices
                </h2>
                <p className="text-lg text-text-secondary">
                    Find the right technology faster.
                </p>
            </div>

            {/* Desktop Grid (3x2) / Mobile Horizontal Scroll */}
            <div className="flex md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto md:overflow-x-visible pb-8 md:pb-0 snap-x snap-mandatory hide-scrollbar">
                {CATEGORIES_DATA.map((cat, i) => (
                    <div key={cat.title} className="w-[85vw] md:w-auto shrink-0 snap-center">
                        <CategoryCard 
                            title={cat.title}
                            subtitle={cat.subtitle}
                            icon={cat.icon}
                            delay={i * 0.05}
                        />
                    </div>
                ))}
            </div>
            
            {/* Added style specifically to hide the scrollbar for the clean look */}
            <style jsx="true">{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
