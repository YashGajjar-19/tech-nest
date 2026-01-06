import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Terminal } from "lucide-react";
import Logo from "../ui/Logo";

export default function Footer() {
    return (
        <footer className="border-t border-[var(--border-color)] bg-[var(--bg-card)] mt-20 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* BRAND */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <Logo />
                        <p className="text-xs font-mono text-[var(--text-secondary)] leading-relaxed max-w-sm">
                            The advanced hardware registry for the next generation of tech enthusiasts.
                            Neural-link ready.
                        </p>
                        <div className="flex items-center gap-4 pt-4">
                            <SocialIcon icon={Github} />
                            <SocialIcon icon={Twitter} />
                            <SocialIcon icon={Linkedin} />
                        </div>
                    </div>

                    {/* LINKS */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-500">System</h4>
                        <ul className="space-y-2 text-xs font-mono text-[var(--text-secondary)]">
                            <li><Link to="/battle" className="hover:text-cyan-500 transition-colors">Battle_Arena</Link></li>
                            <li><Link to="/admin" className="hover:text-cyan-500 transition-colors">Admin_Access</Link></li>
                            <li><a href="#" className="hover:text-cyan-500 transition-colors">API_Status</a></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Legal</h4>
                        <ul className="space-y-2 text-xs font-mono text-[var(--text-secondary)]">
                            <li><a href="#" className="hover:text-cyan-500 transition-colors">Privacy_Protocol</a></li>
                            <li><a href="#" className="hover:text-cyan-500 transition-colors">Terms_of_Service</a></li>
                        </ul>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="border-t border-[var(--border-color)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-mono text-[var(--text-secondary)]">
                        © 2024 TECH NEST SYSTEMS. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-500/50">
                        <Terminal size={12} />
                        <span>SYSTEM_OPTIMIZED</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon: Icon }) {
    return (
        <a href="#" className="w-8 h-8 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:border-cyan-500 hover:text-cyan-500 transition-all">
            <Icon size={14} />
        </a>
    )
}