import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getProfileByUsername, getProfileById } from '@/services/apiProfiles';

import ProfileHeader from '@/components/profile/ProfileHeader';
import SavedDevices from '@/components/profile/SavedDevices';
import ActivityList from '@/components/profile/ActivityList';
import ProfileSettings from '@/components/profile/ProfileSettings';
import Container from '@/components/layout/Container';
import NotFound from '@/pages/main/NotFound';
import { Loader2 } from 'lucide-react';

export default function PublicProfile ()
{
    const { username } = useParams();
    const { user, loading: authLoading } = useAuth();
    const location = useLocation();

    const [ profile, setProfile ] = useState( null );
    const [ loading, setLoading ] = useState( true );
    const [ notFound, setNotFound ] = useState( false );

    const isMyProfileRoute = location.pathname === '/profile';

    useEffect( () =>
    {
        if ( authLoading ) return;

        let isMounted = true;
        setLoading( true );

        const fetchProfile = async () =>
        {
            try
            {
                // If it's your own profile view through /profile
                if ( isMyProfileRoute )
                {
                    if ( !user )
                    {
                        return; // Handle redirect component below
                    }
                    const myProfile = await getProfileById( user.id );
                    if ( isMounted ) setProfile( myProfile );
                    return;
                }

                // Or loading via /u/:username
                if ( username )
                {
                    const foundProfile = await getProfileByUsername( username );
                    if ( foundProfile )
                    {
                        if ( isMounted ) setProfile( foundProfile );
                    } else
                    {
                        if ( isMounted ) setNotFound( true );
                    }
                }
            } catch ( error )
            {
                console.error( "Failed to load profile:", error );
                if ( isMounted ) setNotFound( true );
            } finally
            {
                if ( isMounted ) setLoading( false );
            }
        };

        fetchProfile();

        return () => { isMounted = false; };
    }, [ authLoading, user, username, isMyProfileRoute ] );

    // Handle authentication redirect for /profile route
    if ( isMyProfileRoute && !authLoading && !user )
    {
        return <Navigate to="/" replace />; // You can redirect to login logic later
    }

    if ( loading || authLoading )
    {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 animate-pulse">
                <Loader2 className="w-10 h-10 animate-spin text-brand" />
                <p className="text-text-muted font-mono tracking-widest text-sm uppercase">Loading Identity</p>
            </div>
        );
    }

    if ( notFound )
    {
        return <NotFound />;
    }

    const isOwner = user && profile && user.id === profile.id;

    // For activity proxy we'll fetch recent devices in a simple array
    // Since we'll just pass some fake props for MVP activity to SavedDevices/ActivityList logic, 
    // real activity fetch goes later. We'll pass empty to ActivityList for now to keep it from erroring.

    return (
        <Container className="pt-8 pb-32 animate-in fade-in duration-500">
            {/* Header Identity Layer */ }
            <ProfileHeader profile={ profile } />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-16 pt-8">
                {/* Main Content Area */ }
                <div className="flex flex-col gap-12">
                    <SavedDevices userId={ profile.id } isOwner={ isOwner } />
                </div>

                {/* Sidebar */ }
                <div className="flex flex-col gap-8">
                    { isOwner && (
                        <ProfileSettings
                            profile={ profile }
                            onUpdate={ ( updated ) => setProfile( updated ) }
                        />
                    ) }

                    <div className="bg-glass-bg border border-border-subtle rounded-2xl p-6 mt-6 lg:mt-0">
                        <ActivityList recentDevices={ [] } />
                    </div>
                </div>
            </div>
        </Container>
    );
}
