import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Hash, Calendar, Settings } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import ImageUpload from "@/components/ui/ImageUpload";

// Validation Schema
const generalSchema = z.object({
    brand_id: z.string().min(1, "Brand is required"),
    category_id: z.string().min(1, "Category is required"),
    model_name: z.string().min(2, "Model name must be at least 2 characters"),
    slug: z.string().min(2, "Slug is required"),
    release_date: z.string().optional().nullable(),
    image_url: z.string().optional().nullable(),
    is_foldable: z.boolean().default(false),
    ai_summary: z.string().optional().nullable()
});

export default function GeneralForm({ deviceId, onSaved }) {
    const [loading, setLoading] = useState(false);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    
    const { register, handleSubmit, setValue, control, reset, formState: { errors } } = useForm({
        resolver: zodResolver(generalSchema),
        defaultValues: {
            brand_id: "",
            category_id: "",
            model_name: "",
            slug: "",
            release_date: "",
            image_url: "",
            is_foldable: false,
            ai_summary: ""
        }
    });

    // Fetch Brands and Existing Device Data
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load Brands
                const { data: brandsData, error: brandsError } = await supabase
                    .from('brands')
                    .select('id, name')
                    .order('name');
                if (brandsError) throw brandsError;
                setBrands(brandsData || []);

                // Load Categories
                const { data: catData, error: catError } = await supabase
                    .from('device_categories')
                    .select('id, name')
                    .order('name');
                if (catError) throw catError;
                setCategories(catData || []);

                // Load Device if not "new"
                if (deviceId && deviceId.toString().length > 10) { // Check for UUID vs mock numeric ID
                    const { data: devData, error: devError } = await supabase
                        .from('devices')
                        .select('*')
                        .eq('id', deviceId)
                        .single();
                    
                    if (devError && devError.code !== 'PGRST116') throw devError;
                    
                    if (devData) {
                        reset({
                            brand_id: devData.brand_id || "",
                            category_id: devData.category_id || "",
                            model_name: devData.model_name || "",
                            slug: devData.slug || "",
                            release_date: devData.release_date ? devData.release_date.substring(0, 10) : "",
                            image_url: devData.image_url || "",
                            is_foldable: devData.is_foldable || false,
                            ai_summary: devData.ai_summary || ""
                        });
                    }
                } else {
                    reset({
                        brand_id: "",
                        category_id: "",
                        model_name: "",
                        slug: "",
                        release_date: "",
                        image_url: "",
                        is_foldable: false,
                        ai_summary: ""
                    }); // clear form for new device
                }
            } catch (err) {
                console.error("Error loading general data:", err);
                toast.error("Failed to load device details");
            }
        };

        loadData();
    }, [deviceId, reset]);

    const onSubmit = async (data) => {
        setLoading(true);
        toast.loading("Saving Device OS...", { id: "save_device" });
        try {
            // Nullify empties
            const payload = { ...data };
            if (!payload.release_date) payload.release_date = null;
            if (!payload.image_url) payload.image_url = null;
            if (!payload.ai_summary) payload.ai_summary = null;

            if (deviceId && deviceId.toString().length > 10) {
                // Update
                const { error } = await supabase
                    .from('devices')
                    .update(payload)
                    .eq('id', deviceId);
                if (error) throw error;
                toast.success("Device Updated Successfully", { id: "save_device" });
                if (onSaved) onSaved(deviceId);
            } else {
                // Create
                const { data: newDev, error } = await supabase
                    .from('devices')
                    .insert([payload])
                    .select()
                    .single();
                
                if (error) throw error;
                toast.success("New Device Created", { id: "save_device" });
                if (onSaved) onSaved(newDev.id);
            }
        } catch (err) {
            console.error(err);
            toast.error("Save failed: " + err.message, { id: "save_device" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form id="general-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Brand */}
                <div className="space-y-2">
                    <label className="text-[9px] font-mono uppercase tracking-widest opacity-60 ml-2">Brand_Registry</label>
                    <select
                        {...register("brand_id")}
                        className="w-full bg-bg-main border border-border-color rounded-xl py-3 px-4 text-xs font-mono outline-none focus:border-cyan-500/50"
                        disabled={loading}
                    >
                        <option value="">-- SELECT_BRAND --</option>
                        {brands.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                    {errors.brand_id && <p className="text-red-500 text-xs mt-1 px-2">{errors.brand_id.message}</p>}
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <label className="text-[9px] font-mono uppercase tracking-widest opacity-60 ml-2">Device_Class</label>
                    <select
                        {...register("category_id")}
                        className="w-full bg-bg-main border border-border-color rounded-xl py-3 px-4 text-xs font-mono outline-none focus:border-cyan-500/50"
                        disabled={loading}
                    >
                        <option value="">-- SELECT_CLASS --</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <p className="text-red-500 text-xs mt-1 px-2">{errors.category_id.message}</p>}
                </div>

                {/* Model Name */}
                <div className="space-y-2">
                    <label className="text-[9px] font-mono uppercase tracking-widest opacity-60 ml-2">Hardware_Model_Identifier</label>
                    <input
                        {...register("model_name")}
                        placeholder="e.g. Galaxy S24 Ultra"
                        className="w-full bg-bg-main border border-border-color rounded-xl py-3 px-4 text-xs font-mono outline-none focus:border-cyan-500/50"
                        disabled={loading}
                        onChange={(e) => {
                            // Auto-generate slug
                            const val = e.target.value;
                            setValue("model_name", val, { shouldValidate: true });
                            if (val) {
                                setValue("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""), { shouldValidate: true });
                            }
                        }}
                    />
                    {errors.model_name && <p className="text-red-500 text-xs mt-1 px-2">{errors.model_name.message}</p>}
                </div>

                {/* Slug */}
                <div className="space-y-2">
                    <label className="text-[9px] font-mono uppercase tracking-widest opacity-60 ml-2">SEO_Routing_Slug</label>
                    <div className="relative">
                        <Hash size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            {...register("slug")}
                            className="w-full bg-bg-main border border-border-color rounded-xl py-3 pl-9 pr-4 text-xs font-mono outline-none focus:border-cyan-500/50"
                            disabled={loading}
                        />
                    </div>
                    {errors.slug && <p className="text-red-500 text-xs mt-1 px-2">{errors.slug.message}</p>}
                </div>

                {/* Release Date */}
                <div className="space-y-2">
                    <label className="text-[9px] font-mono uppercase tracking-widest opacity-60 ml-2">Launch_Date</label>
                    <div className="relative">
                        <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="date"
                            {...register("release_date")}
                            className="w-full bg-bg-main border border-border-color rounded-xl py-3 pl-9 pr-4 text-xs font-mono outline-none focus:border-cyan-500/50 scheme-dark"
                            disabled={loading}
                        />
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload Component */}
                <Controller
                    control={control}
                    name="image_url"
                    render={({ field }) => (
                        <ImageUpload
                            value={field.value}
                            onChange={(url) => field.onChange(url)}
                        />
                    )}
                />

                <div className="space-y-6">
                    {/* Foldable Checkbox */}
                    <div className="flex items-center gap-3 p-4 bg-bg-main border border-border-color rounded-xl h-[72px]">
                        <Settings size={14} className="text-cyan-500" />
                        <div className="flex-1">
                            <p className="text-xs font-mono font-bold">Foldable Architecture</p>
                            <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Enable flexible display logic</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" {...register("is_foldable")} className="sr-only peer" disabled={loading} />
                            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                        </label>
                    </div>

                    {/* AI Summary */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-mono uppercase tracking-widest opacity-60 ml-2">AI_Generated_Summary</label>
                        <textarea
                            {...register("ai_summary")}
                            rows={3}
                            placeholder="Auto-generated psychological profile of the device..."
                            className="w-full bg-bg-main border border-border-color rounded-xl py-3 px-4 text-xs font-mono outline-none focus:border-cyan-500/50 resize-y"
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>

            {/* Hidden Submit Button (triggered by parent layout) */}
            <button type="submit" id="general-submit" className="hidden">Submit</button>
        </form>
    );
}
