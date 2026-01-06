import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadDeviceImage } from "@/services/apiProducts";
import toast from "react-hot-toast";

export default function ImageUpload({ value, onChange }) {
    const [uploading, setUploading] = useState(false);

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadDeviceImage(file);
            onChange(url); // Send URL back to parent form
            toast.success("ASSET_UPLOADED");
        } catch (error) {
            toast.error("UPLOAD_FAILED");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-[9px] font-mono uppercase tracking-widest opacity-60 ml-2">
                Visual_Asset (Upload)
            </label>

            <div className="relative w-full h-32 border border-dashed border-[var(--border-color)] bg-[var(--bg-main)] rounded-xl overflow-hidden hover:border-cyan-500/50 transition-colors group">

                {/* 1. LOADING STATE */}
                {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                        <Loader2 className="animate-spin text-cyan-500" />
                    </div>
                )}

                {/* 2. IMAGE PREVIEW */}
                {value ? (
                    <div className="relative w-full h-full">
                        <img src={value} alt="Preview" className="w-full h-full object-contain p-2" />
                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-md hover:scale-110 transition-transform"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ) : (
                    /* 3. UPLOAD BUTTON */
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                        <Upload size={20} className="text-[var(--text-secondary)] mb-2 group-hover:text-cyan-500 transition-colors" />
                        <span className="text-[9px] font-mono uppercase text-[var(--text-secondary)]">Click_to_Upload</span>
                        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    </label>
                )}
            </div>
        </div>
    );
}