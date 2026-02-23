import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Home from "@/pages/main/Home";
import DeviceDetail from "@/pages/main/DeviceDetail";
import Battle from "@/pages/main/Battle";
import Inventory from "@/pages/admin/Inventory";
import AddDevice from "@/pages/admin/AddDevice";
import EditDevice from "@/pages/admin/EditDevice";
import DeviceManager from "@/pages/admin/DeviceManager";
import NotFound from "@/pages/main/NotFound";

import ErrorPage from "@/pages/main/ErrorPage";

const router = createBrowserRouter([
    // PUBLIC ROUTES
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            { path: "/", element: <Home /> },
            { path: "devices/:slug", element: <DeviceDetail /> },
            { path: "battle", element: <Battle /> },
        ],
    },

    // ADMIN ROUTES (Protected)
    {
        path: "/admin",
        element: <ProtectedRoute />, // 1. Check if Admin
        children: [
            {
                element: <AdminLayout />, // 2. If yes, render Admin Layout
                children: [
                    { path: "inventory", element: <Inventory /> },
                    { path: "devices", element: <DeviceManager /> },
                    { path: "add-device", element: <AddDevice /> },
                    { path: "edit-device/:id", element: <EditDevice /> },
                    { path: "*", element: <NotFound /> }
                ]
            }
        ]
    }
]);

export default router;