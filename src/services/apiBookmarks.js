import { supabase } from "@/lib/supabase";

export async function getSavedDevices(userId) {
    const { data, error } = await supabase
        .from('bookmarks')
        .select(`
            device_id,
            devices (
                id,
                name,
                brand,
                slug,
                image_url,
                price
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Flatten array since device info is nested inside `devices`
    return data.map(b => b.devices);
}

export async function checkIfSaved(userId, deviceId) {
    if (!userId) return false;
    
    const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', userId)
        .eq('device_id', deviceId)
        .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    
    return !!data;
}

export async function toggleSaveDevice(userId, deviceId, isCurrentlySaved) {
    if (isCurrentlySaved) {
        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('user_id', userId)
            .eq('device_id', deviceId);
            
        if (error) throw error;
        return false; // Now unsaved
    } else {
        const { error } = await supabase
            .from('bookmarks')
            .insert([{ user_id: userId, device_id: deviceId }]);
            
        if (error) throw error;
        return true; // Now saved
    }
}
