import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Smartphone, Zap, Cpu, Database, Image as ImageIcon, ChevronLeft, Box } from "lucide-react";
import { getBrands, createFullDevice } from "@/services/apiDevices";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";

export default function AddDevice ()
{
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState( false );
    const [ brands, setBrands ] = useState( [] );

    // FORM STATE
    const [ formData, setFormData ] = useState( {
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
    } );

    // Load Brands on Mount
    useEffect( () =>
    {
        getBrands().then( setBrands ).catch( () => toast.error( "Failed to load manufacturers" ) );
    }, [] );

    // Handle Input Change
    const handleChange = ( e ) =>
    {
        const { name, value } = e.target;
        // Auto-generate slug from model name
        if ( name === "model_name" )
        {
            setFormData( prev => ( {
                ...prev,
                model_name: value,
                slug: value.toLowerCase().replace( /[^a-z0-9]+/g, "-" ).replace( /(^-|-$)+/g, "" )
            } ) );
        } else
        {
            setFormData( prev => ( { ...prev, [ name ]: value } ) );
        }
    };

    const handleSubmit = async ( e ) =>
    {
        e.preventDefault();
        setLoading( true );

        try
        {
            await createFullDevice( {
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
            } );

            toast.success( "Device deployed successfully" );
            navigate( "/admin/inventory" );
        } catch ( error )
        {
            console.error( error );
            toast.error( "Deployment failed: " + error.message );
        } finally
        {
            setLoading( false );
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <button
                        onClick={ () => navigate( -1 ) }
                        className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors mb-4 group"
                    >
                        <ChevronLeft size={ 16 } className="group-hover:-translate-x-1 transition-transform" />
                        Back to Inventory
                    </button>
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">
                        Deploy New Unit
                    </h1>
                    <p className="text-sm font-medium text-text-secondary mt-1">
                        Initialize a new hardware record in the global database.
                    </p>
                </div>
            </header>

            <form onSubmit={ handleSubmit } className="space-y-8">

                {/* SECTION 1: CORE IDENTITY */ }
                <div className="bg-bg-card border border-border-color rounded-2xl p-8 space-y-8 shadow-premium-sm">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary border-b border-border-color pb-4">
                        <Smartphone size={ 18 } className="text-hyper-cyan" /> Core Identity
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2.5">
                            <label className="text-sm font-semibold text-text-primary ml-1">Manufacturer</label>
                            <select
                                name="brand_id"
                                required
                                value={ formData.brand_id }
                                onChange={ handleChange }
                                className="w-full bg-black/5 dark:bg-white/5 border border-transparent rounded-xl py-3 px-4 text-sm text-text-primary outline-none focus:border-border-color focus:bg-bg-card transition-all"
                            >
                                <option value="">Select a brand</option>
                                { brands.map( b => <option key={ b.id } value={ b.id }>{ b.name }</option> ) }
                            </select>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-sm font-semibold text-text-primary ml-1">Model Name</label>
                            <input
                                name="model_name"
                                required
                                value={ formData.model_name }
                                onChange={ handleChange }
                                placeholder="e.g. Galaxy S24 Ultra"
                                className="w-full bg-black/5 dark:bg-white/5 border border-transparent rounded-xl py-3 px-4 text-sm text-text-primary outline-none focus:border-border-color focus:bg-bg-card transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <label className="text-sm font-semibold text-text-primary ml-1">Device Image</label>
                        <ImageUpload
                            value={ formData.image_url }
                            onChange={ ( url ) => setFormData( prev => ( { ...prev, image_url: url } ) ) }
                            className="bg-black/5! dark:bg-white/5!"
                        />
                    </div>

                    <div className="space-y-2.5">
                        <label className="text-sm font-semibold text-text-primary ml-1">AI Summary Overview</label>
                        <textarea
                            name="ai_summary"
                            rows={ 4 }
                            value={ formData.ai_summary }
                            onChange={ handleChange }
                            placeholder="An intelligent overview of the device's market impact..."
                            className="w-full bg-black/5 dark:bg-white/5 border border-transparent rounded-xl py-3 px-4 text-sm text-text-primary outline-none focus:border-border-color focus:bg-bg-card transition-all resize-none"
                        />
                    </div>
                </div>

                {/* SECTION 2: HARDWARE SPECS */ }
                <div className="bg-bg-card border border-border-color rounded-2xl p-8 space-y-8 shadow-premium-sm">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary border-b border-border-color pb-4">
                        <Cpu size={ 18 } className="text-hyper-cyan" /> Technical Blueprint
                    </h3>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <InputGroup label="Launch Price ($)" name="price" type="number" icon={ Database } value={ formData.price } onChange={ handleChange } />
                        <InputGroup label="Storage (GB)" name="storage" type="number" icon={ Box } value={ formData.storage } onChange={ handleChange } />
                        <InputGroup label="RAM (GB)" name="ram" type="number" icon={ Cpu } value={ formData.ram } onChange={ handleChange } />
                        <InputGroup label="Battery (mAh)" name="battery" value={ formData.battery } onChange={ handleChange } icon={ Zap } />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <InputGroup label="Chipset / Processor" name="chipset" value={ formData.chipset } onChange={ handleChange } icon={ Cpu } />
                        <InputGroup label="Display Resolution" name="display_res" value={ formData.display_res } onChange={ handleChange } icon={ Smartphone } />
                        <InputGroup label="Main Camera" name="camera_main" value={ formData.camera_main } onChange={ handleChange } icon={ ImageIcon } />
                    </div>
                </div>

                {/* ACTION */ }
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={ loading }
                        className="bg-text-primary hover:opacity-90 text-bg-main px-10 py-4 rounded-xl font-bold text-sm transition-all flex items-center gap-3 disabled:opacity-50 shadow-premium-md"
                    >
                        { loading ? "Deploying..." : "Confirm Deployment" } <Save size={ 18 } />
                    </button>
                </div>

            </form>
        </div>
    );
}

// Simple internal helper component
function InputGroup ( { label, icon: Icon, ...props } )
{
    return (
        <div className="space-y-2.5">
            <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider ml-1 flex items-center gap-2">
                { Icon && <Icon size={ 12 } /> } { label }
            </label>
            <input
                { ...props }
                className="w-full bg-black/5 dark:bg-white/5 border border-transparent rounded-xl py-3 px-4 text-sm text-text-primary outline-none focus:border-border-color focus:bg-bg-card transition-all"
            />
        </div>
    )
}