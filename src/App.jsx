import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import router from '@/app/router';

// Contexts
import { AuthProvider } from '@/context/AuthContext';
import { BattleProvider } from '@/context/BattleContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { CommandProvider } from '@/context/CommandContext';

// The new Wrapper
import GlobalLoader from "@/components/shared/GlobalLoader";
import CommandPalette from "@/components/shared/CommandPalette";

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BattleProvider>
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            className: '!bg-[#0a0a0a] !text-white !font-mono !text-sm !border !border-white/10 !rounded-xl !shadow-2xl',
                            style: {
                                borderRadius: '16px',
                                background: '#0a0a0a',
                                color: '#fff',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            },
                            success: {
                                style: {
                                    borderColor: 'rgb(6, 182, 212)', // cyan-500
                                },
                                iconTheme: {
                                    primary: 'rgb(6, 182, 212)',
                                    secondary: '#0a0a0a',
                                },
                            },
                            error: {
                                style: {
                                    borderColor: 'rgb(239, 68, 68)', // red-500
                                },
                                iconTheme: {
                                    primary: 'rgb(239, 68, 68)',
                                    secondary: '#0a0a0a',
                                },
                            },
                        }}
                    />

                    {/* THE GLOBAL LOADER WRAPS THE ROUTER */}
                    <GlobalLoader>
                        <RouterProvider router={router} fallbackElement={null} />
                    </GlobalLoader>

                </BattleProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}