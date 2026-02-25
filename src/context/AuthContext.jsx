/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext( {} );

export const AuthProvider = ( { children } ) =>
{
    const [ user, setUser ] = useState( null );
    const [ loading, setLoading ] = useState( true );

    const [ isAdmin, setIsAdmin ] = useState( false );

    useEffect( () =>
    {
        const fetchUserAndRole = async ( sessionUser ) =>
        {
            setUser( sessionUser );
            if ( !sessionUser )
            {
                setIsAdmin( false );
                setLoading( false );
                return;
            }

            try
            {
                const { data, error } = await supabase
                    .from( "profiles" )
                    .select( "role" )
                    .eq( "id", sessionUser.id )
                    .single();

                if ( !error && data )
                {
                    setIsAdmin( [ 'admin', 'super_admin', 'editor' ].includes( data.role ) );
                }
            } catch ( err )
            {
                console.error( "Failed to fetch role:", err );
            } finally
            {
                setLoading( false );
            }
        };

        // 1. Check active session on load
        supabase.auth.getSession().then( ( { data: { session } } ) =>
        {
            fetchUserAndRole( session?.user ?? null );
        } );

        // 2. Listen for changes (login, logout, auto-refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange( ( _event, session ) =>
        {
            fetchUserAndRole( session?.user ?? null );
        } );

        return () => subscription.unsubscribe();
    }, [] );

    const login = ( email, password ) =>
    {
        return supabase.auth.signInWithPassword( { email, password } );
    };

    const signup = ( email, password ) =>
    {
        return supabase.auth.signUp( { email, password } );
    };

    const loginWithGoogle = () =>
    {
        return supabase.auth.signInWithOAuth( {
            provider: 'google',
            options: {
                // This ensures they come back to the page they started on
                redirectTo: window.location.origin
            }
        } );
    };

    const logout = async () =>
    {
        try
        {
            await supabase.auth.signOut();
        } catch ( error )
        {
            console.error( "Logout error:", error );
        } finally
        {
            // Aggressively clear Supabase tokens from local storage
            Object.keys( localStorage ).forEach( ( key ) =>
            {
                if ( key.startsWith( "sb-" ) && key.endsWith( "-auth-token" ) )
                {
                    localStorage.removeItem( key );
                }
            } );
            setUser( null );
        }
    };

    return (
        <AuthContext.Provider value={ { user, isAdmin, login, signup, logout, loginWithGoogle, loading } }>
            { children }
        </AuthContext.Provider>
    );
};

// Custom Hook to use the context
export const useAuth = () => useContext( AuthContext );