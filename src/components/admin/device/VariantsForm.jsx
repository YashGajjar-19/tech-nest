import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Save, Layers, Loader2, DollarSign, Cpu, Database, MapPin, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function VariantsForm ( { deviceId } )
{
    const [ loading, setLoading ] = useState( false );
    const [ initialLoad, setInitialLoad ] = useState( true );

    const { register, control, handleSubmit, reset } = useForm( {
        defaultValues: {
            variants: []
        }
    } );

    const { fields, append, remove } = useFieldArray( {
        control,
        name: "variants"
    } );

    useEffect( () =>
    {
        const loadVariants = async () =>
        {
            if ( !deviceId || deviceId.toString().length < 10 )
            {
                setInitialLoad( false );
                return;
            }

            try
            {
                const { data, error } = await supabase
                    .from( 'device_variants' )
                    .select( '*' )
                    .eq( 'device_id', deviceId )
                    .order( 'price_launch_usd', { ascending: true } );

                if ( error ) throw error;

                if ( data && data.length > 0 )
                {
                    reset( { variants: data } );
                } else
                {
                    // Start with one empty variant if none exist
                    reset( {
                        variants: [ {
                            region: "Global",
                            ram_gb: "",
                            storage_gb: "",
                            chipset: "",
                            sku: "",
                            price_launch_usd: ""
                        } ]
                    } );
                }
            } catch ( err )
            {
                console.error( err );
                toast.error( "Failed to load hardware variants" );
            } finally
            {
                setInitialLoad( false );
            }
        };

        loadVariants();
    }, [ deviceId, reset ] );

    const onSubmit = async ( data ) =>
    {
        if ( !deviceId || deviceId.toString().length < 10 )
        {
            toast.error( "Save Core Identity first." );
            return;
        }

        setLoading( true );
        toast.loading( "Syncing Hardware Variants...", { id: "save_variants" } );

        try
        {
            const payload = data.variants.map( v => ( {
                id: v.id, // Only present if it exists already
                device_id: deviceId,
                region: v.region || "Global",
                ram_gb: v.ram_gb ? parseInt( v.ram_gb ) : null,
                storage_gb: v.storage_gb ? parseInt( v.storage_gb ) : null,
                chipset: v.chipset || null,
                sku: v.sku || null,
                price_launch_usd: v.price_launch_usd ? parseFloat( v.price_launch_usd ) : null
            } ) );

            // Upsert all variants
            const { error: upsertError } = await supabase
                .from( 'device_variants' )
                .upsert( payload, { onConflict: 'id' } )
                .select();

            if ( upsertError ) throw upsertError;

            // Optional: Handle deletions. A fully robust version would track deleted IDs
            // and remove them. For now, we assume soft-edit or manual cleanup if needed, 
            // or we could delete all and re-insert if we drop the IDs.
            // Let's implement full sync by getting current from DB, comparing against payload, and deleting missing.
            const { data: currentVariants } = await supabase.from( 'device_variants' ).select( 'id' ).eq( 'device_id', deviceId );
            const payloadIds = payload.filter( p => p.id ).map( p => p.id );
            const idsToDelete = currentVariants.filter( c => !payloadIds.includes( c.id ) ).map( c => c.id );

            if ( idsToDelete.length > 0 )
            {
                await supabase.from( 'device_variants' ).delete().in( 'id', idsToDelete );
            }

            toast.success( "Hardware variants synced", { id: "save_variants" } );

            // Reload to get fresh IDs for newly inserted rows
            const { data: freshData } = await supabase
                .from( 'device_variants' )
                .select( '*' )
                .eq( 'device_id', deviceId )
                .order( 'price_launch_usd', { ascending: true } );

            reset( { variants: freshData } );

        } catch ( err )
        {
            console.error( err );
            toast.error( "Failed to sync variants: " + err.message, { id: "save_variants" } );
        } finally
        {
            setLoading( false );
        }
    };

    if ( initialLoad )
    {
        return <div className="p-10 text-center text-cyan-500"><Loader2 className="animate-spin mx-auto" /></div>;
    }

    if ( !deviceId || deviceId.toString().length < 10 )
    {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-64 text-center opacity-40">
                <Layers size={ 48 } className="mb-4 text-cyan-500" />
                <h3 className="font-mono uppercase tracking-widest text-lg text-text-primary mb-2">
                    AWAITING_CORE_INITIALIZATION
                </h3>
                <p className="max-w-xs text-xs font-mono">
                    Please save the Core Identity on the General tab first before configuring hardware variants.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-bg-main p-4 rounded-xl border border-border-color">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 flex items-center gap-2">
                        <span className="w-[4px] h-[4px] rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                        Hardware_Configuration_Matrix
                    </h3>
                    <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Manage RAM, Storage, and Regional pricing</p>
                </div>
                <button
                    type="button"
                    onClick={ () => append( { region: "Global", ram_gb: "", storage_gb: "", chipset: "", sku: "", price_launch_usd: "" } ) }
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-black rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all"
                >
                    <Plus size={ 12 } /> Add_Configuration
                </button>
            </div>

            <form id="variants-form" onSubmit={ handleSubmit( onSubmit ) } className="space-y-4">
                { fields.map( ( field, index ) => (
                    <div key={ field.id } className="p-5 bg-bg-card border border-border-color rounded-2xl relative group hover:border-cyan-500/30 transition-colors">

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                type="button"
                                onClick={ () => remove( index ) }
                                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                title="Remove Variant"
                            >
                                <Trash2 size={ 14 } />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 pr-12">
                            {/* Region */ }
                            <div className="space-y-2 col-span-2 lg:col-span-1">
                                <label className="text-[9px] font-mono uppercase tracking-widest opacity-60 ml-2 flex items-center gap-1">
                                    <MapPin size={ 10 } /> Region
                                </label>
                                <input
                                    { ...register( `variants.${ index }.region` ) }
                                    placeholder="Global"
                                    className="w-full bg-bg-main border border-border-color rounded-xl py-2.5 px-3 text-xs font-mono outline-none focus:border-cyan-500/50"
                                    disabled={ loading }
                                />
                            </div>

                            {/* Storage */ }
                            <div className="space-y-2 col-span-1">
                                <label className="text-[9px] font-mono uppercase tracking-widest opacity-60 ml-2 flex items-center gap-1">
                                    <Database size={ 10 } /> Storage_GB
                                </label>
                                <input
                                    type="number"
                                    { ...register( `variants.${ index }.storage_gb` ) }
                                    placeholder="256"
                                    className="w-full bg-bg-main border border-border-color rounded-xl py-2.5 px-3 text-xs font-mono outline-none focus:border-cyan-500/50"
                                    disabled={ loading }
                                />
                            </div>

                            {/* RAM */ }
                            <div className="space-y-2 col-span-1">
                                <label className="text-[9px] font-mono uppercase tracking-widest opacity-60 ml-2 flex items-center gap-1">
                                    <Cpu size={ 10 } /> RAM_GB
                                </label>
                                <input
                                    type="number"
                                    { ...register( `variants.${ index }.ram_gb` ) }
                                    placeholder="8"
                                    className="w-full bg-bg-main border border-border-color rounded-xl py-2.5 px-3 text-xs font-mono outline-none focus:border-cyan-500/50"
                                    disabled={ loading }
                                />
                            </div>

                            {/* Chipset / SKU */ }
                            <div className="space-y-2 col-span-2 lg:col-span-2">
                                <label className="text-[9px] font-mono uppercase tracking-widest opacity-60 ml-2 flex items-center gap-1">
                                    <Settings size={ 10 } /> Hardware_SKU / Chipset
                                </label>
                                <input
                                    { ...register( `variants.${ index }.chipset` ) }
                                    placeholder="Snapdragon 8 Gen 3"
                                    className="w-full bg-bg-main border border-border-color rounded-xl py-2.5 px-3 text-xs font-mono outline-none focus:border-cyan-500/50"
                                    disabled={ loading }
                                />
                            </div>

                            {/* Price */ }
                            <div className="space-y-2 col-span-2 lg:col-span-1">
                                <label className="text-[9px] font-mono uppercase tracking-widest opacity-60 ml-2 flex items-center gap-1 text-emerald-500">
                                    <DollarSign size={ 10 } /> MSRP_USD
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    { ...register( `variants.${ index }.price_launch_usd` ) }
                                    placeholder="999.00"
                                    className="w-full bg-bg-main border border-border-color rounded-xl py-2.5 px-3 text-xs font-mono outline-none focus:border-cyan-500/50"
                                    disabled={ loading }
                                />
                            </div>
                        </div>

                    </div>
                ) ) }

                { fields.length === 0 && (
                    <div className="py-12 border border-dashed border-border-color rounded-2xl text-center opacity-40">
                        <p className="text-xs font-mono uppercase tracking-widest">No configurations generated</p>
                    </div>
                ) }

                <button type="submit" id="variants-submit" className="hidden">Submit</button>
            </form>
        </div>
    );
}
