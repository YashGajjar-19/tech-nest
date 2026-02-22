import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    // Show a loader while checking session
    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-bg-main text-cyan-500 font-mono">
            SCANNING_BIOMETRICS...
        </div>
    );

    // Simple Admin Check (Replace with your specific email or role logic)
    const isAdmin = user?.email?.includes("admin");

    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}