import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Star, Trash2, ImageIcon, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function MediaForm ( { deviceId } )
{
    const [ media, setMedia ] = useState( [] );
    const [ loading, setLoading ] = useState( false );
    const [ uploading, setUploading ] = useState( false );

    // 1. Load existing media
    const loadMedia = useCallback( async () =>
    {
        if ( !deviceId || deviceId.toString().length < 10 ) return;
        setLoading( true );
        try
        {
            const { data, error } = await supabase
                .from( 'device_media' )
                .select( '*' )
                .eq( 'device_id', deviceId )
                .order( 'is_primary', { ascending: false } )
                .order( 'created_at', { ascending: false } );

            if ( error ) throw error;
            setMedia( data || [] );
        } catch ( err )
        {
            console.error( err );
            toast.error( "Failed to load media assets" );
        } finally
        {
            setLoading( false );
        }
    }, [ deviceId ] );

    useEffect( () =>
    {
        loadMedia();
    }, [ loadMedia ] );

    // 2. Upload handler via Dropzone
    const onDrop = useCallback( async ( acceptedFiles ) =>
    {
        if ( !deviceId || deviceId.toString().length < 10 )
        {
            toast.error( "Save Core Identity first to generate a hardware ID." );
            return;
        }

        setUploading( true );
        const uploadToastId = toast.loading( `Uploading ${ acceptedFiles.length } asset(s)...` );

        try
        {
            for ( const file of acceptedFiles )
            {
                // Generate secure unique path
                const fileExt = file.name.split( '.' ).pop();
                const fileName = `${ deviceId }/${ Math.random().toString( 36 ).substring( 2 ) }_${ Date.now() }.${ fileExt }`;

                // Upload to Supabase Storage (assuming bucket named 'gadgets')
                const { error: uploadError } = await supabase.storage
                    .from( 'gadgets' )
                    .upload( fileName, file );

                if ( uploadError ) throw uploadError;

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from( 'gadgets' )
                    .getPublicUrl( fileName );

                // Determine if this should be the primary image (if it's the first one being uploaded)
                const isPrimary = media.length === 0;

                // Save to device_media table
                const { error: dbError } = await supabase
                    .from( 'device_media' )
                    .insert( [ {
                        device_id: deviceId,
                        media_type: 'gallery',
                        url: publicUrl,
                        is_primary: isPrimary
                    } ] );

                if ( dbError ) throw dbError;

                // If it's primary, also update the main devices table image_url
                if ( isPrimary )
                {
                    await supabase.from( 'devices' ).update( { image_url: publicUrl } ).eq( 'id', deviceId );
                }
            }

            toast.success( "Assets uploaded and linked", { id: uploadToastId } );
            await loadMedia(); // Refresh grid

        } catch ( err )
        {
            console.error( err );
            toast.error( "Upload failed: " + err.message, { id: uploadToastId } );
        } finally
        {
            setUploading( false );
        }
    }, [ deviceId, media.length, loadMedia ] );

    const { getRootProps, getInputProps, isDragActive } = useDropzone( {
        onDrop,
        accept: { 'image/*': [] },
        disabled: uploading || !deviceId || deviceId.toString().length < 10
    } );

    // 3. Set Primary Image Action
    const setPrimary = async ( mediaId, url ) =>
    {
        toast.loading( "Setting Primary Asset...", { id: "primary" } );
        try
        {
            // Unset all currently primary for this device
            await supabase
                .from( 'device_media' )
                .update( { is_primary: false } )
                .eq( 'device_id', deviceId );

            // Set the new primary
            await supabase
                .from( 'device_media' )
                .update( { is_primary: true } )
                .eq( 'id', mediaId );

            // Sync with devices table representation
            await supabase
                .from( 'devices' )
                .update( { image_url: url } )
                .eq( 'id', deviceId );

            toast.success( "Primary asset updated", { id: "primary" } );
            loadMedia();
        } catch ( err )
        {
            toast.error( "Failed to set primary asset", { id: "primary" } );
        }
    };

    // 4. Delete Image Action
    const deleteMedia = async ( mediaId, url, isPrimary ) =>
    {
        if ( !confirm( "Delete this asset permanently?" ) ) return;

        toast.loading( "Purging asset...", { id: "delete" } );
        try
        {
            // Extract the storage path from public URL
            const urlObj = new URL( url );
            const segments = urlObj.pathname.split( '/gadgets/' );
            if ( segments.length === 2 )
            {
                const storagePath = segments[ 1 ];
                // Remove from storage
                await supabase.storage.from( 'gadgets' ).remove( [ storagePath ] );
            }

            // Remove from Database
            await supabase.from( 'device_media' ).delete().eq( 'id', mediaId );

            // If it was primary, remove from devices table too
            if ( isPrimary )
            {
                await supabase.from( 'devices' ).update( { image_url: null } ).eq( 'id', deviceId );
            }

            toast.success( "Asset purged", { id: "delete" } );
            loadMedia();
        } catch ( err )
        {
            toast.error( "Failed to delete asset", { id: "delete" } );
        }
    };

    if ( !deviceId || deviceId.toString().length < 10 )
    {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-64 text-center opacity-40">
                <ImageIcon size={ 48 } className="mb-4 text-cyan-500" />
                <h3 className="font-mono uppercase tracking-widest text-lg text-text-primary mb-2">
                    AWAITING_CORE_INITIALIZATION
                </h3>
                <p className="max-w-xs text-xs font-mono">
                    Please save the Core Identity on the General tab first before attaching visual assets.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* DROPZONE AREA */ }
            <div
                { ...getRootProps() }
                className={ `w-full p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all gap-4
                    ${ isDragActive ? "border-cyan-500 bg-cyan-500/10 text-cyan-500 scale-[1.02]" : "border-border-color bg-bg-main hover:border-cyan-500/50 hover:bg-cyan-500/5" }
                    ${ uploading ? "opacity-50 pointer-events-none" : "" }` }
            >
                <input { ...getInputProps() } />

                { uploading ? (
                    <Loader2 size={ 32 } className="animate-spin text-cyan-500" />
                ) : (
                    <div className={ `p-4 rounded-full ${ isDragActive ? "bg-cyan-500/20" : "bg-white/5" }` }>
                        <Upload size={ 24 } className={ isDragActive ? "text-cyan-500" : "text-neutral-500" } />
                    </div>
                ) }

                <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-widest font-mono text-text-primary">
                        { uploading ? "Transmitting Data..." : isDragActive ? "Drop Asset Here" : "Drop Visual Assets" }
                    </p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] mt-2">
                        { uploading ? "Please wait" : "PNG, JPG, WEBP • Max 5MB per file" }
                    </p>
                </div>
            </div>

            {/* ASSET GRID */ }
            { loading ? (
                <div className="py-20 text-center"><Loader2 className="animate-spin text-cyan-500 mx-auto" /></div>
            ) : media.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    { media.map( ( asset ) => (
                        <div key={ asset.id } className={ `group relative aspect-square rounded-2xl overflow-hidden border bg-bg-main
                            ${ asset.is_primary ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'border-border-color' }
                        `}>
                            {/* The Image */ }
                            <img
                                src={ asset.url }
                                alt="Device media"
                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* Overlay Controls */ }
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                <div className="flex justify-between items-start">
                                    { asset.is_primary ? (
                                        <div className="bg-cyan-500 text-black text-[8px] font-black uppercase px-2 py-1 rounded-sm flex items-center gap-1">
                                            <Star size={ 8 } className="fill-black" /> Primary
                                        </div>
                                    ) : (
                                        <button
                                            onClick={ ( e ) => { e.stopPropagation(); setPrimary( asset.id, asset.url ); } }
                                            className="text-[9px] font-mono text-white/70 hover:text-cyan-400 uppercase tracking-widest bg-black/40 px-2 py-1 rounded-sm hover:bg-black/80 transition-colors"
                                        >
                                            Set_Primary
                                        </button>
                                    ) }

                                    <button
                                        onClick={ ( e ) => { e.stopPropagation(); deleteMedia( asset.id, asset.url, asset.is_primary ); } }
                                        className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-md transition-colors"
                                        title="Delete Asset"
                                    >
                                        <Trash2 size={ 12 } />
                                    </button>
                                </div>

                                <a
                                    href={ asset.url }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-[10px] text-white/50 hover:text-white mt-auto self-start"
                                    onClick={ e => e.stopPropagation() }
                                >
                                    <ExternalLink size={ 10 } /> View_Original
                                </a>
                            </div>
                        </div>
                    ) ) }
                </div>
            ) : (
                <div className="py-20 text-center opacity-40 border border-border-color border-dashed rounded-2xl">
                    <p className="text-xs font-mono uppercase tracking-widest">No visual assets detected.</p>
                </div>
            ) }
        </div>
    );
}
