import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Cpu, Smartphone, Zap } from "lucide-react";
import { getDeviceBySlug } from "@/services/apiProducts";
import Button from "@/components/ui/Button";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function ProductDetail() {
    const { slug } = useParams(); // Grabs 'samsung-s24' from URL
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDeviceBySlug(slug)
            .then(setDevice)
            .catch(() => setDevice(null))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <LoadingScreen message="DECRYPTING_SCHEMATICS" />;
    if (!device) return <NotFound />;

    // Helper: Group specs by Category (Display, Platform, etc.)
    const specsByCategory = device.device_specs.reduce((acc, spec) => {
        const cat = spec.spec_definitions?.category || "Other";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(spec);
        return acc;
    }, {});

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-12 md:pb-24 animate-in fade-in duration-700">

            {/* 1. HEADER & HERO */}
            <div className="mb-12">
                <Link to="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-text-secondary hover:text-cyan-500 mb-6 transition-colors">
                    <ChevronLeft size={14} /> Return_to_Registry
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left: Image */}
                    <div className="relative h-[400px] bg-bg-card rounded-3xl border border-border-color flex items-center justify-center p-10 group">
                        <div className="absolute top-6 left-6">
                            <img src={device.brands.logo_url} className="h-8 opacity-50" alt="brand" />
                        </div>
                        <img src={device.image_url} alt={device.model_name} className="h-full object-contain drop-shadow-[0_0_50px_var(--accent-glow)] group-hover:scale-105 transition-transform duration-500" />
                    </div>

                    {/* Right: Info */}
                    <div className="space-y-6">
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-text-primary">{device.model_name}</h1>
                        <p className="font-mono text-cyan-500 text-sm">{device.ai_summary}</p>

                        <div className="grid grid-cols-3 gap-4 border-y border-border-color py-6 my-6">
                            <SpecHighlight label="Release" value="2024" icon={Smartphone} />
                            <SpecHighlight label="Chipset" value="Snapdragon 8" icon={Cpu} />
                            <SpecHighlight label="Battery" value="5000mAh" icon={Zap} />
                        </div>

                        <Button className="w-full md:w-auto" icon={Zap}>Add_to_Battle_Queue</Button>
                    </div>
                </div>
            </div>

            {/* 2. SPECIFICATION TABLES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                {Object.entries(specsByCategory).map(([category, specs]) => (
                    <div key={category} className="space-y-4">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-text-secondary border-b border-border-color pb-2 flex items-center gap-2">
                            {category}
                        </h3>
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {specs.map((spec) => (
                                    <tr key={spec.spec_key} className="border-b border-border-color hover:bg-bg-card transition-colors">
                                        <td className="py-3 text-[10px] font-bold text-cyan-500 uppercase tracking-widest w-1/3">
                                            {spec.spec_definitions.display_label}
                                        </td>
                                        <td className="py-3 text-sm font-mono text-text-primary">
                                            {spec.raw_value} <span className="text-text-secondary text-[10px]">{spec.spec_definitions.unit}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

        </div>
    );
}

function SpecHighlight({ label, value, icon: Icon }) {
    return (
        <div className="text-center space-y-1">
            <Icon size={16} className="mx-auto text-text-secondary mb-2" />
            <div className="text-[9px] uppercase tracking-widest text-text-secondary">{label}</div>
            <div className="font-bold text-sm text-text-primary">{value}</div>
        </div>
    )
}