import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Edit, Search, RefreshCw, Box, Shield, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProducts, deleteDevice } from "@/services/apiDevices";
import toast from "react-hot-toast";
import { ChevronDown } from "lucide-react";

export default function Inventory ()
{
    const [ products, setProducts ] = useState( [] );
    const [ loading, setLoading ] = useState( true );
    const [ searchTerm, setSearchTerm ] = useState( "" );
    const [ visibleCount, setVisibleCount ] = useState( 6 );

    // 1. Fetch Real Data
    const fetchInventory = async () =>
    {
        setLoading( true );
        try
        {
            const data = await getProducts();
            setProducts( data );
        } catch
        {
            toast.error( "Failed to fetch inventory" );
        } finally
        {
            setLoading( false );
        }
    };

    useEffect( () => { fetchInventory(); }, [] );

    // 2. Delete Handler
    const handleDelete = async ( id ) =>
    {
        if ( !window.confirm( "Are you sure you want to delete this device? This cannot be undone." ) ) return;
        try
        {
            await deleteDevice( id );
            setProducts( prev => prev.filter( p => p.id !== id ) );
            toast.success( "Device deleted successfully" );
        } catch
        {
            toast.error( "Deletion failed" );
        }
    };

    // 3. Filter Logic
    const filteredProducts = products.filter( p =>
        p.model_name.toLowerCase().includes( searchTerm.toLowerCase() ) ||
        p.brands?.name.toLowerCase().includes( searchTerm.toLowerCase() )
    );

    const visibleProducts = filteredProducts.slice( 0, visibleCount );

    return (
        <div className="min-h-screen bg-bg-main text-text-primary p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-500">

            {/* HEADER */ }
            <div className="border-b border-border-color pb-8 mb-8 flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between items-start sm:items-end">
                <div>
                    <div className="flex items-center gap-2 text-text-secondary mb-2">
                        <Database size={ 14 } />
                        <span className="text-xs font-semibold tracking-wide uppercase">System Database</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">
                        Inventory Logs
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={ 16 } />
                        <input
                            type="text"
                            placeholder="Search devices..."
                            value={ searchTerm }
                            onChange={ ( e ) => setSearchTerm( e.target.value ) }
                            className="bg-bg-card border border-border-color py-2.5 pl-10 pr-4 text-sm outline-none focus:border-text-primary/30 focus:shadow-premium-sm transition-all w-64 rounded-xl placeholder:text-text-secondary/60 text-text-primary"
                        />
                    </div>
                    <button
                        onClick={ fetchInventory }
                        className="p-2.5 bg-bg-card border border-border-color rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all text-text-secondary hover:text-text-primary"
                        title="Refresh Inventory"
                    >
                        <RefreshCw size={ 16 } className={ loading ? "animate-spin" : "" } />
                    </button>
                </div>
            </div>

            {/* DATA GRID */ }
            <div className="rounded-2xl border border-border-color bg-bg-card overflow-hidden shadow-premium-sm">
                {/* TABLE HEADER */ }
                <div className="grid grid-cols-12 bg-black/5 dark:bg-white/5 border-b border-border-color text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    <div className="col-span-1 p-4 text-center">ID</div>
                    <div className="col-span-5 p-4">Device Identity</div>
                    <div className="col-span-3 p-4 text-center">Launch Price</div>
                    <div className="col-span-3 p-4 text-center">Operations</div>
                </div>

                <AnimatePresence mode="popLayout">
                    { visibleProducts.map( ( p, idx ) => (
                        <motion.div
                            key={ p.id }
                            layout
                            initial={ { opacity: 0, x: -10 } }
                            animate={ { opacity: 1, x: 0 } }
                            exit={ { opacity: 0, x: 10 } }
                            className="grid grid-cols-12 border-b last:border-0 border-border-color hover:bg-black/2 dark:hover:bg-white/2 transition-colors items-center"
                        >
                            <div className="col-span-1 p-4 text-center text-xs text-text-secondary font-mono">
                                { ( idx + 1 ).toString().padStart( 2, '0' ) }
                            </div>

                            <div className="col-span-5 p-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white border border-border-color flex items-center justify-center p-1.5 shadow-sm">
                                    <img src={ p.image_url } alt={ p.model_name } className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-text-primary leading-tight">{ p.model_name }</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        { p.brands?.logo_url && <img src={ p.brands.logo_url } className="h-3 w-auto opacity-60 dark:invert" alt={ p.brands?.name } /> }
                                        <p className="text-xs text-text-secondary font-medium">{ p.brands?.name }</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-3 p-4 text-center text-sm font-medium text-text-primary">
                                { p.device_variants?.[ 0 ]?.price_launch_usd ? `$${ p.device_variants[ 0 ].price_launch_usd }` : <span className="text-text-secondary/50">---</span> }
                            </div>

                            <div className="col-span-3 p-4 flex justify-center gap-2">
                                <Link
                                    to={ `/admin/edit-device/${ p.id }` }
                                    className="p-2 rounded-lg text-text-secondary hover:bg-black/5 dark:hover:bg-white/10 hover:text-text-primary transition-colors"
                                    title="Edit Device"
                                >
                                    <Edit size={ 16 } />
                                </Link>
                                <button
                                    onClick={ () => handleDelete( p.id ) }
                                    className="p-2 rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                    title="Delete Device"
                                >
                                    <Trash2 size={ 16 } />
                                </button>
                            </div>
                        </motion.div>
                    ) ) }
                </AnimatePresence>

                { filteredProducts.length === 0 && !loading && (
                    <div className="p-16 flex flex-col items-center justify-center text-center">
                        <Database size={ 32 } className="text-text-secondary/30 mb-4" />
                        <p className="text-sm text-text-secondary font-medium">No devices found in the registry.</p>
                    </div>
                ) }
            </div>

            {/* LOAD MORE BUTTON */ }
            { visibleCount < filteredProducts.length && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={ () => setVisibleCount( prev => prev + 6 ) }
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-bg-card border border-border-color text-sm font-medium text-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-sm"
                    >
                        Load More Devices <ChevronDown size={ 14 } />
                    </button>
                </div>
            ) }

            {/* FOOTER STATS */ }
            <div className="mt-8 flex justify-between items-center text-xs text-text-secondary font-medium">
                <div className="flex gap-6">
                    <span className="flex items-center gap-2"><Shield size={ 12 } className="text-emerald-500" /> Admin Access Secure</span>
                    <span className="flex items-center gap-2"><Box size={ 12 } /> Total Devices: <span className="text-text-primary">{ products.length }</span></span>
                </div>
            </div>
        </div>
    );
}