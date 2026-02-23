import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute() {
    const { user, loading } = useAuth();
    const [role, setRole] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            if (!user) {
                setRoleLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .single();

                if (!error && data) {
                    setRole(data.role);
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
            } finally {
                setRoleLoading(false);
            }
        };

        if (!loading) {
            fetchRole();
        }
    }, [user, loading]);

    if (loading || roleLoading) {
        return (
            <div className="min-h-screen bg-bg-main flex items-center justify-center">
                <Loader2 className="animate-spin text-cyan-500 w-8 h-8" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Optional: Restrict to 'editor', 'admin', 'super_admin', 'moderator'
    // For now, if role is just 'user' (the default) or null, they shouldn't access admin
    if (role === 'user' || !role) {
        // You can redirect them to a nice "Unauthorized" page, but for now just send to home
        return <Navigate to="/" replace />;
    }

    // Role is valid (e.g. editor, admin, super_admin, etc.), allow access
    return <Outlet />;
}
