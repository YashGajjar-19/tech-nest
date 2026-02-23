import { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadDeviceImage } from "@/services/apiDevices";
import toast from "react-hot-toast";

export default function ImageUpload ( { value, onChange, className = "" } )
{
    const [ uploading, setUploading ] = useState( false );

    const handleFile = async ( e ) =>
    {
        const file = e.target.files[ 0 ];
        if ( !file ) return;

        setUploading( true );
        try
        {
            const url = await uploadDeviceImage( file );
            onChange( url ); // Send URL back to parent form
            toast.success( "Image uploaded successfully" );
        } catch
        {
            toast.error( "Upload failed" );
        } finally
        {
            setUploading( false );
        }
    };

    return (
        <div className={ `space-y-3 ${ className }` }>
            <div className="relative w-full h-40 border border-dashed border-border-color bg-black/5 dark:bg-white/5 rounded-2xl overflow-hidden hover:border-text-primary/30 transition-all group shadow-sm flex items-center justify-center">

                {/* 1. LOADING STATE */ }
                { uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-bg-main/80 backdrop-blur-sm z-20">
                        <Loader2 className="animate-spin text-hyper-cyan" />
                    </div>
                ) }

                {/* 2. IMAGE PREVIEW */ }
                { value ? (
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                        <img src={ value } alt="Preview" className="max-w-full max-h-full object-contain" />
                        <button
                            type="button"
                            onClick={ () => onChange( "" ) }
                            className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg transition-colors z-10"
                        >
                            <X size={ 14 } />
                        </button>
                    </div>
                ) : (
                    /* 3. UPLOAD BUTTON */
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group">
                        <div className="w-12 h-12 rounded-full bg-text-primary/5 flex items-center justify-center mb-3 group-hover:bg-text-primary/10 transition-colors">
                            <Upload size={ 24 } className="text-text-secondary group-hover:text-text-primary transition-colors" />
                        </div>
                        <p className="text-sm font-semibold text-text-primary">Click to upload</p>
                        <p className="text-xs text-text-secondary mt-1">PNG, JPG or WebP</p>
                        <input type="file" accept="image/*" onChange={ handleFile } className="hidden" />
                    </label>
                ) }
            </div>
        </div>
    );
}