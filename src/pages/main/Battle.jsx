import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Zap, Plus, X, ArrowLeft, Cpu, Smartphone, Battery, Sparkles } from "lucide-react";

export default function Battle() {
    const [searchParams] = useSearchParams();
    // Example URL: /battle?devices=iphone-15-pro-max,samsung-s24
    const initialDevices = searchParams.get("devices")?.split(",") || [];
    
    const [devices, setDevices] = useState([]);
    const [verdicts, setVerdicts] = useState(null);
    const [aiSummary, setAiSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking the FastAPI /compare endpoint response for the UI Design phase.
        // In production: fetch(`http://localhost:8001/compare?a=${initialDevices[0]}&b=${initialDevices[1]}`)
        
        setTimeout(() => {
            setDevices([
                {
                    info: { id: 1, model_name: "Galaxy S24 Ultra", brands: { name: "Samsung" }, image_url: "/placeholder.png" }, // Add real mock images if you want
                    specs: [
                        { spec_key: "battery_capacity_mah", raw_value: "5000 mAh", spec_definitions: { display_label: "Battery", category: "Battery" } },
                        { spec_key: "resolution", raw_value: "1440 x 3120", spec_definitions: { display_label: "Resolution", category: "Display" } },
                        { spec_key: "ram_size", raw_value: "12 GB", spec_definitions: { display_label: "RAM", category: "Performance" } },
                    ]
                },
                {
                    info: { id: 2, model_name: "iPhone 15 Pro Max", brands: { name: "Apple" }, image_url: "/placeholder.png" },
                    specs: [
                        { spec_key: "battery_capacity_mah", raw_value: "4422 mAh", spec_definitions: { display_label: "Battery", category: "Battery" } },
                        { spec_key: "resolution", raw_value: "1290 x 2796", spec_definitions: { display_label: "Resolution", category: "Display" } },
                        { spec_key: "ram_size", raw_value: "8 GB", spec_definitions: { display_label: "RAM", category: "Performance" } },
                    ]
                }
            ]);

            setVerdicts({
                battery: "A",
                resolution: "A",
                ram: "A",
                camera: "Tie"
            });

            setAiSummary("Based on raw specifications, the Galaxy S24 Ultra edges out the iPhone 15 Pro Max with superior hardware metrics in key categories like Battery capacity and RAM. It is the better choice for power users prioritizing performance on paper.");
            
            setLoading(false);
        }, 800);

    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
                <Zap size={48} className="text-hyper-cyan mb-4 animate-spin" />
                <h2 className="text-xl font-bold uppercase tracking-widest text-text-secondary">Analyzing Specs</h2>
            </div>
        );
    }

    const deviceA = devices[0];
    const deviceB = devices[1];

    if (!deviceA || !deviceB) return null; // Fallback empty state

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32 animate-in fade-in duration-700">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary mb-12 transition-colors">
                <ArrowLeft size={16} /> Back to Search
            </Link>
            
            {/* HERO SECTION */}
            <header className="mb-20 text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-hyper-cyan/5 blur-[100px] rounded-full pointer-events-none"></div>
                
                <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-text-primary flex items-center justify-center gap-6 relative z-10">
                    <span className="text-right">{deviceA.info.model_name.split(" ").slice(-2).join(" ")}</span>
                    <span className="text-2xl font-bold text-hyper-cyan bg-bg-card border border-hyper-cyan/30 px-4 py-2 rounded-2xl not-italic tracking-widest shadow-premium-glow">VS</span>
                    <span className="text-left">{deviceB.info.model_name.split(" ").slice(-1).join(" ")}</span>
                </h1>
                <p className="mt-6 text-text-secondary uppercase tracking-widest text-sm font-bold">The Ultimate Matchup</p>
            </header>

            {/* AI SUMMARY */}
            <section className="mb-24 max-w-4xl mx-auto">
                <div className="bg-bg-card/80 backdrop-blur-xl border border-hyper-cyan/30 shadow-premium-glow rounded-3xl p-8 md:p-12 relative overflow-hidden group text-center">
                    <div className="inline-flex items-center justify-center gap-2 mb-6 bg-hyper-cyan text-bg-main px-4 py-1.5 rounded-full shadow-sm">
                        <Sparkles size={16} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Tech Nest Verdict</span>
                    </div>
                    <h2 className="text-3xl font-black text-text-primary uppercase tracking-tight mb-4">
                        Winner: <span className="text-hyper-cyan">{verdicts?.battery === "A" ? deviceA.info.model_name : deviceB.info.model_name}</span>
                    </h2>
                    <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
                        {aiSummary}
                    </p>
                </div>
            </section>

            {/* CATEGORY WINNERS GRID */}
            <section className="mb-24">
                <h3 className="text-lg font-bold uppercase tracking-widest text-text-primary text-center mb-10">Category Breakdown</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Demo dynamic map based on logic */}
                    <CategoryCard icon={Battery} title="Battery Life" verdict={verdicts?.battery} devA={deviceA} devB={deviceB} />
                    <CategoryCard icon={Cpu} title="Performance" verdict={verdicts?.ram} devA={deviceA} devB={deviceB} />
                    <CategoryCard icon={Smartphone} title="Display" verdict={verdicts?.resolution} devA={deviceA} devB={deviceB} />
                </div>
            </section>

            {/* DETAILED SPEC COMPARISON TABLE */}
            <section className="mb-24 border border-border-color bg-bg-card rounded-3xl overflow-hidden shadow-premium-md">
                <div className="grid grid-cols-3 text-center border-b border-border-color bg-bg-main font-bold uppercase tracking-widest text-[10px] text-text-secondary">
                    <div className="p-6 border-r border-border-color flex flex-col items-center gap-4">
                        <img src={deviceA.info.image_url} alt="A" className="h-24 object-contain" />
                        <span>{deviceA.info.model_name}</span>
                    </div>
                    <div className="p-6 flex items-center justify-center">Specifications</div>
                    <div className="p-6 border-l border-border-color flex flex-col items-center gap-4">
                        <img src={deviceB.info.image_url} alt="B" className="h-24 object-contain" />
                        <span>{deviceB.info.model_name}</span>
                    </div>
                </div>

                <div className="divide-y divide-border-color text-sm">
                    {/* Mapping through specs. Assuming specs order is similar, we match by key */}
                    {deviceA.specs.map(specA => {
                        const specB = deviceB.specs.find(s => s.spec_key === specA.spec_key);
                        // Using our mock verdict generator logic here roughly for UI coloring
                        const isAWinner = verdicts[specA.spec_key.split("_")[0]] === "A";
                        const isBWinner = verdicts[specA.spec_key.split("_")[0]] === "B";

                        return (
                            <div key={specA.spec_key} className="grid grid-cols-3 text-center hover:bg-bg-main/50 transition-colors">
                                <div className={`p-4 font-mono font-medium border-r border-border-color ${isAWinner ? "text-green-500" : "text-text-primary"}`}>
                                    {specA.raw_value}
                                </div>
                                <div className="p-4 font-bold text-xs text-text-secondary uppercase tracking-widest">
                                    {specA.spec_definitions?.display_label}
                                </div>
                                <div className={`p-4 font-mono font-medium border-l border-border-color ${isBWinner ? "text-green-500" : "text-text-primary"}`}>
                                    {specB?.raw_value || "--"}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

        </div>
    );
}

function CategoryCard({ icon: Icon, title, verdict, devA, devB }) {
    
    let winnerText = "Tie";
    let subText = "Equal performance";
    if (verdict === "A") {
        winnerText = devA.info.brands.name;
        subText = devA.info.model_name.split(" ").slice(-2).join(" ");
    } else if (verdict === "B") {
        winnerText = devB.info.brands.name;
        subText = devB.info.model_name.split(" ").slice(-2).join(" ");
    }

    return (
        <div className="bg-bg-card border border-border-color rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden group hover:border-hyper-cyan/30 transition-colors">
            {verdict !== "Tie" && <div className="absolute top-0 inset-x-0 h-1 bg-hyper-cyan/50"></div>}
            
            <Icon size={24} className="text-text-secondary mb-4 group-hover:text-hyper-cyan transition-colors" />
            <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">{title}</h4>
            <span className={`text-xl font-black uppercase tracking-tight ${verdict === "Tie" ? "text-text-primary" : "text-hyper-cyan"}`}>
                {winnerText}
            </span>
            <span className="text-sm font-medium text-text-secondary mt-1">{subText}</span>
        </div>
    );
}