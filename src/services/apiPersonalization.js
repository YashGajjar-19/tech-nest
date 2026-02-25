import { supabase } from "@/lib/supabase";

// 1. Log a view when user visits a device page
export async function logDeviceView ( userId, deviceId )
{
    if ( !userId || !deviceId ) return;
    try
    {
        const { error } = await supabase
            .from( 'device_views' )
            .upsert( { user_id: userId, device_id: deviceId, viewed_at: new Date().toISOString() }, { onConflict: 'user_id,device_id' } );

        // Optional: Keep only last 20. A database trigger or scheduled function is better for this, 
        // but we can do a simple cleanup query if needed.
    } catch ( e )
    {
        console.error( "Error logging device view:", e );
    }
}

// 2. Fetch Recently Viewed
export async function getRecentlyViewed ( userId, limit = 5 )
{
    if ( !userId ) return [];

    // Using a join query to get device properties
    const { data, error } = await supabase
        .from( 'device_views' )
        .select( `
            viewed_at,
            devices (
                id, model_name, slug, image_url,
                brands (name, logo_url),
                device_variants (price_launch_usd),
                device_specs (spec_key, raw_value)
            )
        `)
        .eq( 'user_id', userId )
        .order( 'viewed_at', { ascending: false } )
        .limit( limit );

    if ( error )
    {
        console.error( "Error fetching recently viewed:", error );
        return [];
    }

    // Filter out null devices, and return the device objects sorted by viewed_at
    return data.map( item => item.devices ).filter( Boolean );
}

// 3. User Preferences operations
export async function getUserPreferences ( userId )
{
    if ( !userId ) return null;
    const { data, error } = await supabase
        .from( 'user_preferences' )
        .select( '*' )
        .eq( 'user_id', userId )
        .maybeSingle();

    if ( error )
    {
        console.error( "Error fetching preferences:", error );
        return null;
    }
    return data;
}

export async function updateUserPreferences ( userId, prefs )
{
    if ( !userId ) return;
    const { error } = await supabase
        .from( 'user_preferences' )
        .upsert( { user_id: userId, ...prefs, updated_at: new Date().toISOString() } );

    if ( error )
    {
        console.error( "Error updating preferences:", error );
    }
}

// 4. Recommendation Logic (Level 1)
export async function getRecommendations ( userId )
{
    if ( !userId ) return [];

    // 1. Get preferences
    const prefs = await getUserPreferences( userId );
    let preferredBrands = prefs?.preferred_brands || [];

    // 2. If no explicit preferences, try to infer from recently viewed or saved
    if ( preferredBrands.length === 0 )
    {
        const recent = await getRecentlyViewed( userId, 10 );
        if ( recent.length > 0 )
        {
            const brands = recent.map( r => r.brands?.name ).filter( Boolean );
            // Get unique brands
            preferredBrands = [ ...new Set( brands ) ];
        }
    }

    // 3. Fetch recommended devices
    let query = supabase.from( 'devices' ).select( `
        id, model_name, slug, image_url,
        brands!inner (name, logo_url),
        device_variants (price_launch_usd),
        device_specs (spec_key, raw_value)
    ` ).limit( 5 );

    if ( preferredBrands.length > 0 )
    {
        query = query.in( 'brands.name', preferredBrands );
    } else
    {
        // Fallback: Just return some trending or recent devices
        query = query.order( 'created_at', { ascending: false } );
    }

    const { data, error } = await query;
    if ( error )
    {
        console.error( "Error fetching recommendations:", error );
        return [];
    }

    return data;
}

// 5. Get Saved Devices Summary
export async function getSavedDevicesSummary ( userId, limit = 5 )
{
    if ( !userId ) return [];
    const { data, error } = await supabase
        .from( 'bookmarks' )
        .select( `
            devices (
                id, model_name, slug, image_url,
                brands (name, logo_url),
                device_variants (price_launch_usd),
                device_specs (spec_key, raw_value)
            )
        `)
        .eq( 'user_id', userId )
        .order( 'created_at', { ascending: false } )
        .limit( limit );

    if ( error )
    {
        console.error( "Error fetching saved devices summary:", error );
        return [];
    }
    return data.map( item => item.devices ).filter( Boolean );
}
