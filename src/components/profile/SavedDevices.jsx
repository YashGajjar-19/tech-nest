import React, { useEffect, useState } from 'react';
import { getSavedDevices } from '@/services/apiBookmarks';
import { Bookmark, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import CardSkeleton from '@/components/skeleton/CardSkeleton';

export default function SavedDevices ( { userId, isOwner } )
{
    const [ devices, setDevices ] = useState( [] );
    const [ loading, setLoading ] = useState( true );

    useEffect( () =>
    {
        if ( !userId ) return;
        setLoading( true );
        getSavedDevices( userId )
            .then( setDevices )
            .catch( err => console.error( "Failed to fetch saved devices:", err ) )
            .finally( () => setLoading( false ) );
    }, [ userId ] );

    if ( loading )
    {
        return (
            <div className="pt-8">
                <h3 className="text-h3 font-semibold mb-6">Saved Devices</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            </div>
        );
    }

    if ( devices.length === 0 )
    {
        return (
            <div className="pt-8 mb-12">
                <h3 className="text-h3 font-semibold mb-6 flex items-center gap-2">
                    <Bookmark className="text-brand" size={ 24 } />
                    Saved Devices
                </h3>

                <Card className="flex flex-col items-center justify-center p-12 border-dashed bg-transparent shadow-none hover:bg-glass-bg transition-colors">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-text-muted">
                        <LayoutGrid size={ 32 } />
                    </div>
                    <p className="text-lg font-medium text-text-primary mb-2">No saved devices yet</p>
                    <p className="text-sm text-text-muted text-center max-w-sm mb-6">
                        { isOwner
                            ? "Bookmark devices while browsing to quickly access their specs and compare them later."
                            : "This user hasn't saved any devices to their public collection." }
                    </p>
                    { isOwner && (
                        <Link to="/" className="px-6 py-3 rounded-xl bg-bg-surface border border-border-subtle text-text-primary hover:text-white hover:bg-white/5 transition-all outline-none">
                            Discover Devices
                        </Link>
                    ) }
                </Card>
            </div>
        );
    }

    return (
        <div className="pt-8 mb-12">
            <h3 className="text-h3 font-semibold mb-6 flex items-center gap-2">
                <Bookmark className="text-brand" size={ 24 } />
                Saved Devices
                <Badge variant="outline" className="ml-2 font-mono text-xs">{ devices.length }</Badge>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                { devices.map( device => (
                    <Link to={ `/devices/${ device.slug }` } key={ device.id } className="outline-none block">
                        <Card hoverable className="h-full flex flex-col pt-6 group">
                            <div className="px-6 pb-4 flex justify-center h-48">
                                <img
                                    src={ device.image_url || "https://placehold.co/400x400/111827/fff?text=No+Image" }
                                    alt={ device.name }
                                    className="h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                                />
                            </div>
                            <Card.Body className="mt-auto border-t border-border-subtle bg-bg-surface/30 px-6 py-5 pb-6">
                                <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">
                                    { device.brand }
                                </p>
                                <h4 className="text-lg font-semibold text-text-primary mb-3">
                                    { device.name }
                                </h4>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-text-secondary">Expected Price</span>
                                    <span className="font-bold text-brand">{ device.price || "N/A" }</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Link>
                ) ) }
            </div>
        </div>
    );
}
