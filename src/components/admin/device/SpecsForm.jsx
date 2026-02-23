import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Cpu, Info } from "lucide-react";

export default function SpecsForm ( { deviceId } )
{
    const [ loading, setLoading ] = useState( false );
    const [ categories, setCategories ] = useState( {} );

    // Using dynamic generic form because db-driven keys
    const { register, handleSubmit, reset } = useForm();

    useEffect( () =>
    {
        const loadSpecs = async () =>
        {
            if ( !deviceId || deviceId.toString().length < 10 ) return; // Only load for existing real UUID

            try
            {
                // 1. Fetch available Spec Definitions
                const { data: specDefs, error: defError } = await supabase
                    .from( 'spec_definitions' )
                    .select( '*' )
                    .order( 'category', { ascending: true } );
                if ( defError ) throw defError;

                // Group by category
                const grouped = {};
                specDefs.forEach( def =>
                {
                    if ( !grouped[ def.category ] ) grouped[ def.category ] = [];
                    grouped[ def.category ].push( def );
                } );
                setCategories( grouped );

                // 2. Fetch Device's Current Specs
                const { data: currentSpecs, error: specError } = await supabase
                    .from( 'device_specs' )
                    .select( '*' )
                    .eq( 'device_id', deviceId );
                if ( specError ) throw specError;

                // 3. Map to form default values
                const defaultValues = {};
                if ( currentSpecs )
                {
                    currentSpecs.forEach( spec =>
                    {
                        defaultValues[ spec.spec_key ] = spec.raw_value;
                    } );
                }
                reset( defaultValues );

            } catch ( err )
            {
                console.error( err );
                toast.error( "Failed to load spec definitions" );
            }
        };

        loadSpecs();
    }, [ deviceId, reset ] );

    const onSubmit = async ( data ) =>
    {
        if ( !deviceId || deviceId.toString().length < 10 )
        {
            toast.error( "Please save the General tab first to initialize the device." );
            return;
        }

        setLoading( true );
        toast.loading( "Updating technical specifications...", { id: "save_specs" } );
        try
        {
            // Transform form data to DB format
            const upsertPayload = [];
            const deletePayload = []; // Keys that became empty should be deleted

            Object.entries( data ).forEach( ( [ key, value ] ) =>
            {
                if ( value !== undefined && value !== null && value.toString().trim() !== '' )
                {
                    upsertPayload.push( {
                        device_id: deviceId,
                        spec_key: key,
                        raw_value: String( value )
                    } );
                } else
                {
                    deletePayload.push( key );
                }
            } );

            // Upsert Populated Values
            if ( upsertPayload.length > 0 )
            {
                const { error } = await supabase
                    .from( 'device_specs' )
                    .upsert( upsertPayload, { onConflict: 'device_id, spec_key' } );

                if ( error ) throw error;
            }

            // Delete Cleared Values
            if ( deletePayload.length > 0 )
            {
                const { error } = await supabase
                    .from( 'device_specs' )
                    .delete()
                    .eq( 'device_id', deviceId )
                    .in( 'spec_key', deletePayload );

                if ( error ) throw error;
            }

            toast.success( "Specifications updated", { id: "save_specs" } );

        } catch ( err )
        {
            console.error( err );
            toast.error( "Failed to update specs: " + err.message, { id: "save_specs" } );
        } finally
        {
            setLoading( false );
        }
    };

    if ( !deviceId || deviceId.toString().length < 10 )
    {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4">
                    <Cpu size={ 32 } className="text-text-secondary opacity-30" />
                </div>
                <h3 className="font-semibold text-lg text-text-primary mb-2">
                    Specifications Locked
                </h3>
                <p className="max-w-xs text-sm text-text-secondary font-medium">
                    Please save the basic device details in the General tab first to unlock technical settings.
                </p>
            </div>
        );
    }

    return (
        <form id="specs-form" onSubmit={ handleSubmit( onSubmit ) } className="space-y-10">
            { Object.keys( categories ).length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center h-64 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-text-primary/10 border-t-hyper-cyan rounded-full mb-4"></div>
                    <p className="text-sm text-text-secondary font-medium italic">Initializing specification fields...</p>
                </div>
            ) : (
                Object.entries( categories ).map( ( [ categoryName, specs ] ) => (
                    <div key={ categoryName } className="p-8 bg-bg-card border border-border-color rounded-2xl shadow-premium-sm transition-all">
                        <h3 className="text-base font-bold tracking-tight text-text-primary mb-8 pb-4 border-b border-border-color flex items-center gap-2">
                            { categoryName }
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            { specs.map( spec => (
                                <div key={ spec.key_name } className="space-y-2.5">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-sm font-semibold text-text-primary">
                                            { spec.display_label }
                                        </label>
                                        { spec.unit && (
                                            <span className="text-[10px] font-bold text-hyper-cyan bg-hyper-cyan/5 px-2 py-0.5 rounded-md">
                                                { spec.unit }
                                            </span>
                                        ) }
                                    </div>
                                    <input
                                        { ...register( spec.key_name ) }
                                        placeholder={ `Value...` }
                                        disabled={ loading }
                                        className="w-full bg-black/3 dark:bg-white/3 border border-transparent rounded-xl py-3 px-4 text-sm text-text-primary outline-none focus:border-border-color focus:bg-bg-card transition-all placeholder:text-text-secondary/40"
                                    />
                                    { spec.human_explanation && (
                                        <div className="flex items-start gap-1.5 px-1 opacity-50 group">
                                            <Info size={ 10 } className="mt-0.5 shrink-0" />
                                            <p className="text-[10px] leading-relaxed font-medium">
                                                { spec.human_explanation }
                                            </p>
                                        </div>
                                    ) }
                                </div>
                            ) ) }
                        </div>
                    </div>
                ) )
            ) }

            {/* Hidden Submit Button (triggered by parent layout) */ }
            <button type="submit" id="specs-submit" className="hidden">Submit</button>
        </form>
    );
}
