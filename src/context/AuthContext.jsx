import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Check active session on load
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // 2. Listen for changes (login, logout, auto-refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = (email, password) => {
        return supabase.auth.signInWithPassword({ email, password });
    };

    const signup = (email, password) => {
        return supabase.auth.signUp({ email, password });
    };

    const loginWithGoogle = () => {
        return supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // This ensures they come back to the page they started on
                redirectTo: window.location.origin
            }
        });
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            // Aggressively clear Supabase tokens from local storage
            Object.keys(localStorage).forEach((key) => {
                if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
                    localStorage.removeItem(key);
                }
            });
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loginWithGoogle, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use the context
export const useAuth = () => useContext(AuthContext);