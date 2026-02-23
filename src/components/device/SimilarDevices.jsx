import DeviceCard from "@/components/ui/DeviceCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SimilarDevices() {
    // Mock similar devices array
    const similarDevices = [
        {
            id: 101,
            slug: "samsung-s23-ultra",
            model_name: "Galaxy S23 Ultra",
            image_url: "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&q=80&w=400",
            ai_summary: "Former king, still a beast.",
            brands: { name: "Samsung" }
        },
        {
            id: 102,
            slug: "iphone-15-pro",
            model_name: "iPhone 15 Pro",
            image_url: "https://images.unsplash.com/photo-1695048132959-19e91e6b8a8b?auto=format&fit=crop&q=80&w=400",
            ai_summary: "Titanium logic, fluid OS.",
            brands: { name: "Apple" }
        },
        {
            id: 103,
            slug: "pixel-8-pro",
            model_name: "Pixel 8 Pro",
            image_url: "https://images.unsplash.com/photo-1696515582390-eec1a4cb9a66?auto=format&fit=crop&q=80&w=400",
            ai_summary: "The AI photography wizard.",
            brands: { name: "Google" }
        }
    ];

    return (
        <section className="mb-24">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Similar Hardware</h2>
                <Link to="/" className="text-xs font-bold text-text-secondary uppercase tracking-widest hover:text-hyper-cyan transition-colors flex items-center gap-1 group">
                    Explore DB <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarDevices.map((dev) => (
                    <DeviceCard key={dev.id} product={dev} />
                ))}
            </div>
        </section>
    );
}
