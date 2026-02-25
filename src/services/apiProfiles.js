import { supabase } from "@/lib/supabase";

export async function getProfileByUsername(username) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
        
    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
    }
    
    return data;
}

export async function getProfileById(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
    if (error) throw error;
    return data;
}

export async function updateProfile(userId, updates) {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
        
    if (error) throw error;
    return data;
}
