import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, UserPlus, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function AuthModal({ isOpen, onClose }) {
    const { login, signup } = useAuth();
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

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* BACKDROP */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
                    />

                    {/* MODAL PANEL */}
                    <motion.div
                        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-[450px] z-[101] bg-[var(--bg-card)] border-l border-[var(--border-color)] shadow-2xl flex flex-col"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)]">
                            <span className="text-xs font-black text-cyan-500 uppercase tracking-widest">
                                System_Access_Point
                            </span>
                            <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-10 flex-1 overflow-y-auto">
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
                                {isLogin ? "Welcome_Back" : "Join_Registry"}
                            </h2>
                            <p className="text-[10px] text-[var(--text-secondary)] font-mono mb-10 uppercase tracking-widest">
                                {isLogin ? "Enter credentials to decrypt session" : "Create new neural identity"}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-mono flex items-center gap-2">
                                        <AlertCircle size={14} /> {error.toUpperCase()}
                                    </div>
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
                                    className="w-full py-5 text-sm"
                                    isLoading={loading}
                                    icon={isLogin ? LogIn : UserPlus}
                                >
                                    {isLogin ? "Initialize_Link" : "Create_Identity"}
                                </Button>
                            </form>

                            <div className="mt-8 text-center">
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-[10px] font-mono text-[var(--text-secondary)] hover:text-cyan-500 uppercase tracking-widest transition-colors"
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