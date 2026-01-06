import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import Home from "@/pages/public/Home";
import ProductDetail from "@/pages/public/ProductDetail";
import Battle from "@/pages/public/Battle";
import Inventory from "@/pages/admin/Inventory";
import AddProduct from "@/pages/admin/AddProduct";
import EditProduct from "@/pages/admin/EditProduct";

const router = createBrowserRouter([
    // PUBLIC ROUTES
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "devices/:slug", element: <ProductDetail /> },
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
                    { path: "add-product", element: <AddProduct /> },
                    { path: "edit-product/:id", element: <EditProduct /> },
                ]
            }
        ]
    }
]);

export default router;