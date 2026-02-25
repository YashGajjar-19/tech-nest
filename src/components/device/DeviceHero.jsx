import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Zap, Smartphone, Cpu, Battery, Bookmark, Share } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { checkIfSaved, toggleSaveDevice } from "@/services/apiBookmarks";
import toast from "react-hot-toast";

export default function DeviceHero({ device }) {
    const { user } = useAuth();
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!user || !device?.id) return;
        checkIfSaved(user.id, device.id).then(setIsSaved).catch(console.error);
    }, [user, device?.id]);

    const handleToggleSave = async () => {
        if (!user) {
            toast.error("Please log in to save items");
            return;
        }

        setIsSaving(true);
        try {
            const newState = await toggleSaveDevice(user.id, device.id, isSaved);
            setIsSaved(newState);
            if (newState) {
                toast.success("Saved to your profile!");
            } else {
                toast.success("Removed from bookmarks");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update bookmark");
        } finally {
            setIsSaving(false);
        }
    };
    // Score placeholder for now
    const techNestScore = 92;

    return (
        <section className="mb-16">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary mb-8 transition-colors">
                <ChevronLeft size={16} /> Back to Registry
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* LEFT: Device Image */}
                <div className="relative aspect-4/3 bg-bg-card rounded-3xl border border-border-color flex items-center justify-center p-8 group overflow-hidden">
                    <div className="absolute top-6 left-6 z-10">
                        {device.brands?.logo_url ? (
                            <img src={device.brands.logo_url} className="h-6 opacity-40 grayscale" alt="brand" />
                        ) : (
                            <span className="text-sm font-bold opacity-40 uppercase tracking-wider">{device.brands?.name}</span>
                        )}
                    </div>
                    <img 
                        src={device.image_url || "/placeholder-device.png"} 
                        alt={device.model_name} 
                        className="h-[80%] object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700 ease-out z-10" 
                    />
                    
                    {/* Subtle glow behind image */}
                    <div className="absolute inset-0 bg-linear-to-tr from-transparent via-transparent to-hyper-cyan/5 opacity-50"></div>
                </div>

                {/* RIGHT: Device Identity */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3 text-sm font-medium text-text-secondary uppercase tracking-wider">
                            <span>{device.brands?.name || "Unknown Brand"}</span>
                            <span>•</span>
                            <span>Smartphone</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-none mb-6">
                            {device.model_name}
                        </h1>

                        {/* Tech Nest Score Badge */}
                        <div className="inline-flex items-center gap-4 bg-bg-card border border-border-color rounded-2xl p-2 pr-6">
                            <div className="flex items-center justify-center w-12 h-12 bg-text-primary text-bg-main rounded-xl font-bold text-lg">
                                {techNestScore}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Tech Nest Score</span>
                                <span className="text-sm font-medium">Exceptional device</span>
                            </div>
                        </div>
                    </div>

                    {/* Key Specs Chips */}
                    <div className="flex flex-wrap gap-3">
                        <SpecChip icon={Cpu} text="Snapdragon 8 Gen 3" />
                        <SpecChip icon={Smartphone} text="120Hz LTPO AMOLED" />
                        <SpecChip icon={Battery} text="5000mAh Battery" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4 border-t border-border-color">
                        <Button className="flex-1 justify-center py-4" icon={Zap}>
                            Compare Device
                        </Button>
                        <button 
                            onClick={handleToggleSave}
                            disabled={isSaving}
                            className={`flex items-center justify-center w-14 h-14 rounded-xl border transition-all ${
                                isSaved 
                                ? 'border-brand bg-brand/10 text-brand' 
                                : 'border-border-color bg-bg-card hover:bg-white/5 text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            <Bookmark size={20} className={isSaved ? 'fill-brand' : ''} />
                        </button>
                        <button className="flex items-center justify-center w-14 h-14 rounded-xl border border-border-color bg-bg-card hover:bg-border-color transition-colors text-text-secondary hover:text-text-primary">
                            <Share size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SpecChip({ icon: Icon, text }) {
    return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-card border border-border-color text-sm font-medium text-text-primary">
            <Icon size={16} className="text-text-secondary" />
            <span>{text}</span>
        </div>
    );
}
