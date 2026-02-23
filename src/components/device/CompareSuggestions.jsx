import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function CompareSuggestions ()
{
    const suggestions = [
        "iPhone 15 Pro Max",
        "Pixel 8 Pro",
        "OnePlus 12",
        "Xiaomi 14 Ultra"
    ];

    return (
        <section className="mb-24 p-8 border border-border-color bg-bg-card rounded-3xl relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-hyper-cyan/10 rounded-full blur-[60px] pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-text-primary uppercase tracking-tight mb-2 flex items-center gap-2">
                        <Zap size={ 24 } className="text-hyper-cyan" />
                        Battle Ground
                    </h2>
                    <p className="text-sm text-text-secondary leading-relaxed max-w-md">
                        Compare specs side-by-side. See how this device holds up against the toughest competitors on the market.
                    </p>
                </div>

                <div className="flex-1 flex flex-wrap gap-3">
                    { suggestions.map( ( s, idx ) => (
                        <Link
                            key={ idx }
                            to="/battle" // Placeholder route for battle/compare
                            className="bg-bg-main border border-border-color hover:border-text-secondary hover:text-text-primary text-text-secondary transition-colors text-sm font-semibold uppercase tracking-wider py-2 px-4 rounded-xl"
                        >
                            vs { s }
                        </Link>
                    ) ) }
                </div>
            </div>
        </section>
    );
}
