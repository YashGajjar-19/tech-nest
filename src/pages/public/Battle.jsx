import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Zap, Trophy, Plus } from "lucide-react";
import { useBattle } from "@/context/BattleContext";
import { getDevicesForBattle } from "@/services/apiProducts";

export default function Battle() {
    const { selectedDevices, removeFromBattle } = useBattle();
    const [fullData, setFullData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (selectedDevices.length === 0) {
            setFullData([]);
            setLoading(false);
            return;
        }

        const ids = selectedDevices.map(d => d.id);
        setLoading(true);

        getDevicesForBattle(ids)
            .then(setFullData)
            .finally(() => setLoading(false));
    }, [selectedDevices]);

    // SPEC KEYS TO COMPARE (You can expand this list)
    const COMPARISON_KEYS = [
        { key: "display_res", label: "Display" },
        { key: "chipset", label: "Processor" },
        { key: "ram", label: "RAM" },
        { key: "battery", label: "Battery" },
        { key: "camera_main", label: "Main Camera" }
    ];

    if (selectedDevices.length === 0) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <div className="w-24 h-24 bg-[var(--bg-card)] rounded-full flex items-center justify-center mb-6">
                <Zap size={32} className="text-[var(--text-secondary)]/20" />
            </div>
            <h1 className="text-3xl font-black italic uppercase text-[var(--text-secondary)] mb-4">Arena_Empty</h1>
            <Link to="/" className="text-cyan-500 font-mono text-xs tracking-widest hover:underline">
              // SELECT_UNITS_FROM_REGISTRY
            </Link>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-20">
            <header className="mb-12 border-b border-[var(--border-color)] pb-8">
                <h1 className="text-5xl font-black italic uppercase tracking-tighter">
                    BATTLE<span className="text-cyan-500">.</span>MODE
                </h1>
            </header>

            {/* COMPARISON GRID */}
            <div className="overflow-x-auto pb-10">
                <div className="min-w-[800px] grid" style={{ gridTemplateColumns: `150px repeat(${fullData.length}, 1fr)` }}>

                    {/* HEADER ROW (Images) */}
                    <div className="p-4 flex items-end font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">
                        VS_MATRIX
                    </div>
                    {fullData.map(device => (
                        <div key={device.id} className="relative p-6 border-l border-[var(--border-color)] bg-[var(--bg-card)] flex flex-col items-center text-center gap-4">
                            <button
                                onClick={() => removeFromBattle(device.id)}
                                className="absolute top-2 right-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                            <img src={device.image_url} className="h-32 object-contain" />
                            <div>
                                <p className="text-[10px] text-cyan-500 font-bold uppercase">{device.brands.name}</p>
                                <h3 className="text-lg font-black italic uppercase leading-none">{device.model_name}</h3>
                            </div>
                        </div>
                    ))}

                    {/* DYNAMIC SPEC ROWS */}
                    {COMPARISON_KEYS.map((row) => (
                        <>
                            <div className="p-4 py-6 border-t border-[var(--border-color)] font-mono text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center">
                                {row.label}
                            </div>
                            {fullData.map((device) => {
                                // Find the spec value in the nested array
                                const spec = device.device_specs.find(s => s.spec_key === row.key);
                                return (
                                    <div key={`${device.id}-${row.key}`} className="p-4 py-6 border-t border-l border-[var(--border-color)] text-sm font-bold text-[var(--text-primary)] text-center flex items-center justify-center">
                                        {spec ? spec.raw_value : "--"}
                                    </div>
                                );
                            })}
                        </>
                    ))}

                </div>
            </div>
        </div>
    );
}