import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Smartphone, Zap, Cpu, Database, Image as ImageIcon } from "lucide-react";
import { getBrands, getDeviceById, updateFullDevice } from "@/services/apiProducts";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";

export default function EditProduct() {
    const { id } = useParams(); // Get ID from URL
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [brands, setBrands] = useState([]);

    // STATE (Same as AddProduct)
    const [formData, setFormData] = useState({
        brand_id: "", model_name: "", slug: "", image_url: "", ai_summary: "",
        price: "", storage: "", ram: "",
        chipset: "", display_res: "", battery: "", camera_main: ""
    });

    // LOAD DATA
    useEffect(() => {
        async function loadData() {
            try {
                const [brandsData, deviceData] = await Promise.all([
                    getBrands(),
                    getDeviceById(id)
                ]);
                setBrands(brandsData);

                // Populate Form
                const variant = deviceData.device_variants?.[0] || {};

                // Convert spec array to object map
                const specsMap = {};
                deviceData.device_specs?.forEach(s => {
                    specsMap[s.spec_key] = s.raw_value;
                });

                setFormData({
                    brand_id: deviceData.brand_id,
                    model_name: deviceData.model_name,
                    slug: deviceData.slug,
                    image_url: deviceData.image_url,
                    ai_summary: deviceData.ai_summary,
                    price: variant.price_launch_usd || "",
                    storage: variant.storage_gb || "",
                    ram: variant.ram_gb || "",
                    chipset: specsMap.chipset || "",
                    display_res: specsMap.display_res || "",
                    battery: specsMap.battery || "",
                    camera_main: specsMap.camera_main || ""
                });
            } catch (error) {
                console.error(error);
                toast.error("DATA_CORRUPT");
                navigate("/admin/inventory");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateFullDevice(id, {
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

            toast.success("UNIT_RECALIBRATED_SUCCESSFULLY");
            navigate("/admin/inventory");
        } catch (error) {
            console.error(error);
            toast.error("UPDATE_FAILED");
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center font-mono text-cyan-500">DECRYPTING_SOURCE_CODE...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-10">
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                    Modify_Unit
                </h1>
                <p className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest mt-2">
            // EDITING: {formData.model_name}
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

                    <ImageUpload
                        value={formData.image_url}
                        onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                    />

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

                <div className="flex justify-end">
                    <button type="submit" className="bg-cyan-500 text-black px-8 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center gap-3">
                        SAVE_CHANGES <Save size={16} />
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
