import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Zap, Trophy, Plus } from "lucide-react";
import { useBattle } from "@/context/BattleContext";
import { getDevicesForBattle } from "@/services/apiProducts";

export default function Battle() {
    const { selectedDevices, removeFromBattle } = useBattle();
    const [fullData, setFullData] = useState([]);

    useEffect(() => {
        if (selectedDevices.length === 0) {
            queueMicrotask(() => setFullData([]));
            return;
        }

        const ids = selectedDevices.map(d => d.id);

        getDevicesForBattle(ids)
            .then(setFullData);
    }, [selectedDevices]);

    // SPEC KEYS TO COMPARE (You can expand this list)
    const COMPARISON_KEYS = [
        { key: "display_res", label: "Display" },
        { key: "chipset", label: "Processor" },
        { key: "ram", label: "RAM" },
        { key: "battery", label: "Battery" },
        { key: "camera_main", label: "Main Camera" }
    ];

    const displayData = fullData.length > 0 ? fullData : [null, null];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-16 md:pb-24">
            <header className="mb-12 border-b border-border-color pb-8">
                <h1 className="text-5xl font-black italic uppercase tracking-tighter">
                    BATTLE<span className="text-cyan-500">.</span>MODE
                </h1>
            </header>

            {/* COMPARISON GRID */}
            <div className="overflow-x-auto pb-10">
                <div className="min-w-[800px] grid" style={{ gridTemplateColumns: `150px repeat(${displayData.length}, 1fr)` }}>

                    {/* HEADER ROW (Images) */}
                    <div className="p-4 flex items-end font-mono text-[10px] text-text-secondary uppercase tracking-widest">
                        VS_MATRIX
                    </div>
                    {displayData.map((device, idx) => (
                        device ? (
                            <div key={device.id} className="relative p-6 border-l border-border-color bg-bg-card flex flex-col items-center text-center gap-4">
                                <button
                                    onClick={() => removeFromBattle(device.id)}
                                    className="absolute top-2 right-2 text-text-secondary hover:text-red-500 transition-colors cursor-pointer z-10"
                                >
                                    <Trash2 size={14} />
                                </button>
                                <img src={device.image_url} className="h-32 object-contain" />
                                <div>
                                    <p className="text-[10px] text-cyan-500 font-bold uppercase">{device.brands.name}</p>
                                    <h3 className="text-lg font-black italic uppercase leading-none">{device.model_name}</h3>
                                </div>
                            </div>
                        ) : (
                            <div key={`empty-${idx}`} className="relative p-6 border-l border-border-color bg-bg-main flex flex-col items-center justify-center text-center min-h-[250px] group">
                                <Link to="/" className="flex flex-col items-center gap-3 w-full h-full justify-center">
                                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-border-color group-hover:border-cyan-500 flex items-center justify-center bg-bg-card group-hover:bg-cyan-500/10 transition-all">
                                        <Plus size={24} className="text-text-secondary group-hover:text-cyan-500 transition-colors" />
                                    </div>
                                    <p className="text-[10px] font-mono font-bold tracking-widest uppercase text-text-secondary group-hover:text-cyan-500 transition-colors">
                                        ADD_UNIT
                                    </p>
                                </Link>
                            </div>
                        )
                    ))}

                    {/* DYNAMIC SPEC ROWS */}
                    {COMPARISON_KEYS.map((row) => (
                        <div key={row.key} className="contents">
                            <div className="p-4 py-6 border-t border-border-color font-mono text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center">
                                {row.label}
                            </div>
                            {displayData.map((device, idx) => {
                                if (!device) {
                                    return (
                                        <div key={`empty-spec-${idx}-${row.key}`} className="p-4 py-6 border-t border-l border-border-color text-sm font-bold text-text-secondary/30 text-center flex items-center justify-center">
                                            --
                                        </div>
                                    );
                                }
                                // Find the spec value in the nested array
                                const spec = device.device_specs?.find(s => s.spec_key === row.key);
                                return (
                                    <div key={`${device.id}-${row.key}`} className="p-4 py-6 border-t border-l border-border-color text-sm font-bold text-text-primary text-center flex items-center justify-center">
                                        {spec ? spec.raw_value : "--"}
                                    </div>
                                );
                            })}
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}