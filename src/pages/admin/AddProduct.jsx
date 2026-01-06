import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Smartphone, Zap, Cpu, Database, Image as ImageIcon } from "lucide-react";
import { getBrands, createFullDevice } from "@/services/apiProducts";
import toast from "react-hot-toast";

export default function AddProduct() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [brands, setBrands] = useState([]);

    // FORM STATE
    const [formData, setFormData] = useState({
        brand_id: "",
        model_name: "",
        slug: "",
        image_url: "",
        ai_summary: "",
        // Variant Data
        price: "",
        storage: "",
        ram: "",
        // Specs
        chipset: "",
        display_res: "",
        battery: "",
        camera_main: ""
    });

    // Load Brands on Mount
    useEffect(() => {
        getBrands().then(setBrands).catch(() => toast.error("BRANDS_OFFLINE"));
    }, []);

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Auto-generate slug from model name
        if (name === "model_name") {
            setFormData(prev => ({
                ...prev,
                model_name: value,
                slug: value.toLowerCase().replace(/ /g, "-")
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createFullDevice({
                device: {
                    brand_id: formData.brand_id,
                    model_name: formData.model_name,
                    slug: formData.slug,
                    image_url: formData.image_url,
                    ai_summary: formData.ai_summary
                },
                variant: {
                    price: formData.price,
                    storage: formData.storage,
                    ram: formData.ram
                },
                specs: {
                    chipset: formData.chipset,
                    display_res: formData.display_res,
                    battery: formData.battery,
                    camera_main: formData.camera_main
                }
            });

            toast.success("UNIT_DEPLOYED_SUCCESSFULLY");
            navigate("/admin/inventory");
        } catch (error) {
            console.error(error);
            toast.error("DEPLOYMENT_FAILED: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-10">
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                    Deploy_New_Unit
                </h1>
                <p className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest mt-2">
            // INIT_SEQUENCE_STARTED
                </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* SECTION 1: CORE IDENTITY */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 space-y-6">
                    <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-40">
                        <Smartphone size={14} /> Core_Identity
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-mono uppercase tracking-widest opacity-60 ml-2">Manufacturer</label>
                            <select
                                name="brand_id"
                                required
                                value={formData.brand_id}
                                onChange={handleChange}
                                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl py-3 px-4 text-xs font-mono outline-none focus:border-cyan-500/50"
                            >
                                <option value="">-- SELECT_BRAND --</option>
                                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-mono uppercase tracking-widest opacity-60 ml-2">Model Name</label>
                            <input
                                name="model_name"
                                required
                                value={formData.model_name}
                                onChange={handleChange}
                                placeholder="EX: GALAXY S25"
                                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl py-3 px-4 text-xs font-mono outline-none focus:border-cyan-500/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-mono uppercase tracking-widest opacity-60 ml-2">Visual_Asset_URL</label>
                        <div className="flex gap-4">
                            <input
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="HTTPS://..."
                                className="flex-1 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl py-3 px-4 text-xs font-mono outline-none focus:border-cyan-500/50"
                            />
                            {formData.image_url && (
                                <div className="w-12 h-12 bg-white rounded-lg p-1 border border-white/10">
                                    <img src={formData.image_url} className="w-full h-full object-contain" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-mono uppercase tracking-widest opacity-60 ml-2">AI_Summary_Generator</label>
                        <textarea
                            name="ai_summary"
                            rows={3}
                            value={formData.ai_summary}
                            onChange={handleChange}
                            placeholder="Short description of the device..."
                            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl py-3 px-4 text-xs font-mono outline-none focus:border-cyan-500/50"
                        />
                    </div>
                </div>

                {/* SECTION 2: HARDWARE SPECS */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 space-y-6">
                    <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-40">
                        <Cpu size={14} /> Hardware_Matrix
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <InputGroup label="Launch Price ($)" name="price" type="number" icon={Database} value={formData.price} onChange={handleChange} />
                        <InputGroup label="Storage (GB)" name="storage" type="number" icon={Database} value={formData.storage} onChange={handleChange} />
                        <InputGroup label="RAM (GB)" name="ram" type="number" icon={Database} value={formData.ram} onChange={handleChange} />
                        <InputGroup label="Battery (mAh)" name="battery" value={formData.battery} onChange={handleChange} icon={Zap} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border-color)]">
                        <InputGroup label="Chipset / Processor" name="chipset" value={formData.chipset} onChange={handleChange} icon={Cpu} />
                        <InputGroup label="Display Resolution" name="display_res" value={formData.display_res} onChange={handleChange} icon={Smartphone} />
                        <InputGroup label="Main Camera" name="camera_main" value={formData.camera_main} onChange={handleChange} icon={ImageIcon} />
                    </div>
                </div>

                {/* ACTION */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-cyan-500 text-black px-8 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                        {loading ? "INITIALIZING..." : "CONFIRM_DEPLOYMENT"} <Save size={16} />
                    </button>
                </div>

            </form>
        </div>
    );
}

// Simple internal helper component
function InputGroup({ label, icon: Icon, ...props }) {
    return (
        <div className="space-y-2">
            <label className="text-[9px] font-mono uppercase tracking-widest opacity-60 ml-2 flex items-center gap-2">
                {Icon && <Icon size={10} />} {label}
            </label>
            <input
                {...props}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl py-3 px-4 text-xs font-mono outline-none focus:border-cyan-500/50"
            />
        </div>
    )
}