import { useState, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Save, Trash2, Smartphone, Cpu, ImageIcon, Layers, FileText, Settings } from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import GeneralForm from "@/components/admin/device/GeneralForm";
import SpecsForm from "@/components/admin/device/SpecsForm";
import MediaForm from "@/components/admin/device/MediaForm";
import VariantsForm from "@/components/admin/device/VariantsForm";

export default function DeviceManager ()
{
    const [ searchQuery, setSearchQuery ] = useState( "" );
    const [ activeTab, setActiveTab ] = useState( "general" );
    const [ devices, setDevices ] = useState( [] );
    const [ selectedDevice, setSelectedDevice ] = useState( null );

    useEffect(() => {
        const fetchDevices = async () => {
            const { data, error } = await supabase
                .from('devices')
                .select(`id, model_name, created_at, image_url, brands(name)`)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error("Failed to load devices", error);
                toast.error("Failed to load devices");
                return;
            }

            const formatted = data.map(d => ({
                id: d.id,
                name: d.model_name,
                brand: d.brands?.name || "Unknown",
                status: "Draft", // You can calculate this based on missing fields
                image_url: d.image_url
            }));

            setDevices(formatted);
            if (formatted.length > 0) setSelectedDevice(formatted[0]);
        };
        fetchDevices();
    }, []);

    // Keyboard shortcuts
    useHotkeys( "n", ( e ) =>
    {
        e.preventDefault();
        handleNewDevice();
    }, { enableOnFormTags: false } );

    useHotkeys( "s", ( e ) =>
    {
        e.preventDefault();
        handleSave();
    }, { enableOnFormTags: false } );

    useHotkeys( "slash", ( e ) =>
    {
        e.preventDefault();
        document.getElementById( "device-search" )?.focus();
    }, { enableOnFormTags: false } );

    const handleNewDevice = () =>
    {
        setSelectedDevice( { id: "new", name: "New Device", brand: "", status: "Draft" } );
        setActiveTab( "general" );
        toast.success( "Created new device draft" );
    };

    const handleDeviceSaved = (newDeviceId) => {
        // We can reload the device list entirely or just wait for the user to search.
        // For now let's just trigger a reload by setting state.
        toast.success("Identity Secured");
        // To properly select the new device ID:
        setSelectedDevice(prev => ({ ...prev, id: newDeviceId }));
    };

    const handleSave = () =>
    {
        if ( activeTab === "general" ) {
            document.getElementById( "general-submit" )?.click();
        } else if ( activeTab === "specs" ) {
            document.getElementById( "specs-submit" )?.click();
        } else if ( activeTab === "variants" ) {
            document.getElementById( "variants-submit" )?.click();
        } else {
            toast.success( `Saved module: ${ activeTab }` );
        }
    };

    const tabs = [
        { id: "general", label: "General", icon: <Smartphone size={ 16 } /> },
        { id: "specs", label: "Specs", icon: <Cpu size={ 16 } /> },
        { id: "media", label: "Media", icon: <ImageIcon size={ 16 } /> },
        { id: "variants", label: "Variants", icon: <Layers size={ 16 } /> },
        { id: "ai", label: "AI Summary", icon: <FileText size={ 16 } /> },
        { id: "seo", label: "SEO", icon: <Settings size={ 16 } /> },
    ];

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6 overflow-hidden">
            {/* LEFT PANEL: DEVICE LIST & FILTERS */ }
            <div className="w-1/3 min-w-[300px] flex flex-col bg-bg-card border border-border-color rounded-2xl overflow-hidden shadow-premium-sm">
                {/* Search & Actions */ }
                <div className="p-5 border-b border-border-color space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-text-primary">
                            Devices
                        </h2>
                        <button
                            onClick={ handleNewDevice }
                            className="bg-text-primary hover:opacity-90 text-bg-main p-2 rounded-xl transition-colors cursor-pointer shadow-premium-sm"
                            title="New Device (N)"
                        >
                            <Plus size={ 16 } />
                        </button>
                    </div>

                    <div className="relative">
                        <Search size={ 16 } className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                            id="device-search"
                            type="text"
                            placeholder="Search models... (/)"
                            value={ searchQuery }
                            onChange={ ( e ) => setSearchQuery( e.target.value ) }
                            className="w-full bg-black/5 dark:bg-white/5 border border-transparent rounded-xl py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-border-color focus:bg-bg-card transition-all"
                        />
                    </div>
                </div>

                {/* List */ }
                <div className="flex-1 overflow-y-auto no-scrollbar p-3">
                    { devices.map( ( device ) => (
                        <div
                            key={ device.id }
                            onClick={ () => setSelectedDevice( device ) }
                            className={ `p-4 rounded-xl cursor-pointer transition-all mb-2 flex items-center justify-between border ${ selectedDevice?.id === device.id
                                ? "bg-text-primary/5 border-border-color text-text-primary shadow-sm"
                                : "bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary"
                                }` }
                        >
                            <div>
                                <p className="font-semibold text-sm text-text-primary">{ device.name }</p>
                                <p className="text-xs text-text-secondary mt-0.5">
                                    { device.brand || "No Brand" }
                                </p>
                            </div>
                            <div className={ `text-xs font-semibold px-2.5 py-1 rounded-full ${ device.status === 'Published'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                }` }>
                                { device.status }
                            </div>
                        </div>
                    ) ) }
                </div>

                <div className="p-4 border-t border-border-color text-xs text-text-secondary/60 text-center font-medium">
                    Press <kbd className="font-mono bg-black/5 dark:bg-white/10 px-1 rounded mx-1">N</kbd> to add • <kbd className="font-mono bg-black/5 dark:bg-white/10 px-1 rounded mx-1">/</kbd> to search
                </div>
            </div>

            {/* RIGHT PANEL: DEVICE EDITOR */ }
            <div className="flex-1 flex flex-col bg-bg-card border border-border-color rounded-2xl overflow-hidden shadow-premium-sm relative">
                { selectedDevice ? (
                    <>
                        {/* Editor Header */ }
                        <div className="p-6 border-b border-border-color flex items-center justify-between bg-bg-card z-10">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                                    { selectedDevice.name }
                                </h1>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-xs font-mono text-text-secondary bg-text-primary/5 px-2 py-0.5 rounded-md">
                                        ID: { selectedDevice.id }
                                    </span>
                                    <span className={ `text-xs font-medium px-2 py-0.5 rounded-md ${ selectedDevice.status === 'Published' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400' }` }>
                                        { selectedDevice.status }
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    className="p-2.5 text-text-secondary hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all cursor-pointer"
                                    title="Delete Device"
                                >
                                    <Trash2 size={ 18 } />
                                </button>
                                <button
                                    onClick={ handleSave }
                                    className="px-5 py-2.5 bg-text-primary hover:opacity-90 text-bg-main font-medium text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-premium-sm"
                                    title="Save Device (S)"
                                >
                                    <Save size={ 16 } />
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        {/* Editor Tabs & Content Area */ }
                        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
                            {/* Vertical Tabs */ }
                            <div className="w-full sm:w-48 border-b sm:border-b-0 sm:border-r border-border-color p-4 flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible">
                                { tabs.map( ( tab ) => (
                                    <button
                                        key={ tab.id }
                                        onClick={ () => setActiveTab( tab.id ) }
                                        className={ `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left whitespace-nowrap ${ activeTab === tab.id
                                            ? "bg-text-primary/5 text-text-primary font-medium"
                                            : "text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-primary"
                                            }` }
                                    >
                                        <span className={ activeTab === tab.id ? "text-text-primary" : "opacity-70" }>{ tab.icon }</span>
                                        <span className="text-sm">{ tab.label }</span>
                                    </button>
                                ) ) }
                            </div>

                            {/* Main Content Area */ }
                            <div className="flex-1 p-8 overflow-y-auto no-scrollbar relative">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={ activeTab }
                                        initial={ { opacity: 0, y: 10 } }
                                        animate={ { opacity: 1, y: 0 } }
                                        exit={ { opacity: 0, y: -10 } }
                                        transition={ { duration: 0.2 } }
                                        className="h-full"
                                    >
                                        { activeTab === "general" ? (
                                            <GeneralForm deviceId={ selectedDevice.id } onSaved={ handleDeviceSaved } />
                                        ) : activeTab === "specs" ? (
                                            <SpecsForm deviceId={ selectedDevice.id } />
                                        ) : activeTab === "media" ? (
                                            <MediaForm deviceId={ selectedDevice.id } />
                                        ) : activeTab === "variants" ? (
                                            <VariantsForm deviceId={ selectedDevice.id } />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-center">
                                                { tabs.find( t => t.id === activeTab )?.icon && (
                                                    <div className="text-text-secondary/50 mb-4 scale-[2]">
                                                        { tabs.find( t => t.id === activeTab )?.icon }
                                                    </div>
                                                ) }
                                                <h3 className="font-semibold text-lg text-text-primary mb-2 mt-4">
                                                    { tabs.find( t => t.id === activeTab )?.label } Settings
                                                </h3>
                                                <p className="max-w-xs text-sm text-text-secondary">
                                                    Configure the { tabs.find( t => t.id === activeTab )?.label.toLowerCase() } details for this device.
                                                </p>
                                            </div>
                                        ) }
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center flex-col text-text-secondary">
                        <Smartphone size={ 48 } className="mb-4 opacity-20" />
                        <p className="font-medium text-sm">Select a device to view or edit</p>
                    </div>
                ) }
            </div>
        </div>
    );
}
