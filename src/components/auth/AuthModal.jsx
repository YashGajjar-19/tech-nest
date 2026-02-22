import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, UserPlus, LogIn, AlertCircle, Chrome } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function AuthModal({ isOpen, onClose }) {
    const { login, signup, loginWithGoogle } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const { error } = isLogin
                ? await login(email, password)
                : await signup(email, password);

            if (error) throw error;

            toast.success(isLogin ? "IDENTITY_CONFIRMED" : "REGISTRY_COMPLETE");
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await loginWithGoogle();
            if (error) throw error;
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* BACKDROP */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
                    />

                    {/* MODAL PANEL */}
                    <motion.div
                        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full max-w-[450px] z-[101] bg-bg-card border-l border-border-color shadow-2xl flex flex-col"
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-center p-6 border-b border-border-color bg-bg-main/50 backdrop-blur-sm">
                            <span className="text-xs font-mono font-black text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                                System_Access_Point
                            </span>
                            <button 
                                onClick={onClose} 
                                className="text-text-secondary hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 md:p-10 flex-1 overflow-y-auto custom-scrollbar">
                            <div className="mb-8">
                                <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-2 text-text-primary">
                                    {isLogin ? "Welcome_Back" : "Join_Registry"}
                                </h2>
                                <p className="text-[10px] md:text-xs text-text-secondary font-mono uppercase tracking-widest">
                                    {isLogin ? "// Enter credentials to decrypt session" : "// Create new neural identity"}
                                </p>
                            </div>

                            {/* GOOGLE LOGIN BUTTON */}
                            <button
                                onClick={handleGoogleLogin}
                                className="group w-full py-4 mb-8 rounded-xl border border-border-color bg-bg-main text-text-primary hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                <Chrome size={18} className="text-text-secondary group-hover:text-cyan-400 transition-colors" />
                                <span className="font-mono text-xs font-bold tracking-widest uppercase z-10">
                                    Authenticate_With_Google
                                </span>
                            </button>

                            <div className="relative mb-8 text-center">
                                <hr className="border-border-color" />
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-card px-3 text-[10px] font-mono uppercase text-text-secondary tracking-widest">
                                    Or_Decrypt_Manually
                                </span>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-mono flex items-center gap-3 rounded-lg"
                                    >
                                        <AlertCircle size={14} /> 
                                        <span className="uppercase tracking-wide">{error}</span>
                                    </motion.div>
                                )}

                                <Input
                                    name="email"
                                    type="email"
                                    label="Neural_ID (Email)"
                                    icon={Mail}
                                    required
                                    autoFocus
                                />

                                <Input
                                    name="password"
                                    type="password"
                                    label="Security_Key"
                                    icon={Lock}
                                    required
                                />

                                <Button
                                    type="submit"
                                    className="w-full py-5 text-sm mt-4"
                                    isLoading={loading}
                                    icon={isLogin ? LogIn : UserPlus}
                                >
                                    {isLogin ? "Initialize_Link" : "Create_Identity"}
                                </Button>
                            </form>

                            <div className="mt-8 text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError("");
                                    }}
                                    className="text-[10px] font-mono text-text-secondary hover:text-cyan-500 uppercase tracking-widest transition-colors"
                                >
                                    {isLogin ? "// Access_Denied? Create_New_ID" : "// Has_ID? Return_To_Login"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}