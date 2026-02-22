import { Link } from "react-router-dom";
import { 
    Github, 
    Twitter, 
    Linkedin, 
    Instagram, 
    Youtube, 
    ArrowUp, 
    ShieldCheck, 
    Cpu, 
    Globe, 
    Mail 
} from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative bg-bg-main border-t border-border-color pt-24 pb-12 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-hyper-cyan/20 to-transparent" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-hyper-cyan/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
                    
                    {/* BRAND SECTION */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link to="/" className="flex items-center gap-3 group w-fit">
                            <Logo className="text-text-primary group-hover:scale-105 transition-transform duration-500" size={28} />
                            <span className="text-xl font-bold tracking-tight text-text-primary italic uppercase">Tech Nest<span className="text-hyper-cyan">.</span></span>
                        </Link>
                        
                        <p className="text-sm font-medium text-text-secondary leading-relaxed max-w-sm">
                            The intelligent discovery engine for high-end technology. Synchronizing users with the hardware that defines their digital blueprint.
                        </p>

                        <div className="flex items-center gap-4">
                            <SocialIcon icon={Github} href="https://github.com" />
                            <SocialIcon icon={Twitter} href="https://twitter.com" />
                            <SocialIcon icon={Linkedin} href="https://linkedin.com" />
                        </div>
                    </div>

                    {/* LINKS GRID */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
                        {/* DISCOVER */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-text-secondary opacity-60 flex items-center gap-2">
                                <Cpu size={12} className="text-hyper-cyan" /> 01_Discover
                            </h4>
                            <ul className="space-y-4">
                                <FooterLink to="/category/phones">Smartphones</FooterLink>
                                <FooterLink to="/category/laptops">Computing</FooterLink>
                                <FooterLink to="/category/audio">Audio Core</FooterLink>
                                <FooterLink to="/battle" highlight>Battle Mode</FooterLink>
                            </ul>
                        </div>

                        {/* INTEL */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-text-secondary opacity-60 flex items-center gap-2">
                                <ShieldCheck size={12} className="text-hyper-cyan" /> 02_Intel
                            </h4>
                            <ul className="space-y-4">
                                <FooterLink to="/news">Daily Feed</FooterLink>
                                <FooterLink to="/reviews">Neural Reviews</FooterLink>
                                <FooterLink to="/guides">System Guides</FooterLink>
                                <FooterLink to="/trending">Trend Matrix</FooterLink>
                            </ul>
                        </div>

                        {/* NETWORK */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-text-secondary opacity-60 flex items-center gap-2">
                                <Globe size={12} className="text-hyper-cyan" /> 03_Network
                            </h4>
                            <ul className="space-y-4">
                                <FooterLink to="/about">Project Memo</FooterLink>
                                <FooterLink to="/contact">Signal Support</FooterLink>
                                <li className="text-[13px] font-bold text-text-secondary opacity-50 flex items-center gap-2 italic">
                                    Career Nodes <span className="text-[8px] font-black not-italic py-0.5 px-2 rounded-full border border-border-color bg-bg-card text-hyper-cyan">OFFLINE</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* SUBSCRIPTION & STATUS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-y border-border-color mb-10 items-center">
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-bg-card border border-border-color items-center justify-center text-hyper-cyan shadow-inner">
                            <Mail size={20} />
                        </div>
                        <div>
                            <h5 className="text-sm font-black uppercase tracking-widest text-text-primary">Join the Protocol</h5>
                            <p className="text-xs text-text-secondary font-mono mt-1 opacity-70">Get weekly hardware synchronization updates.</p>
                        </div>
                    </div>
                    
                    <div className="flex p-1.5 rounded-2xl border border-border-color bg-bg-card/40 backdrop-blur-sm focus-within:border-hyper-cyan/30 transition-all max-w-md w-full ml-auto group/input">
                        <input 
                            type="email" 
                            placeholder="user@network.com" 
                            className="bg-transparent border-none outline-none px-4 text-xs font-mono w-full text-text-primary placeholder:text-text-secondary/30 focus:ring-0"
                        />
                        <button className="bg-text-primary text-bg-main hover:bg-hyper-cyan hover:text-black transition-all duration-500 rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest shrink-0 shadow-lg group-hover/input:shadow-hyper-cyan/10">
                            Sync_Email
                        </button>
                    </div>
                </div>

                {/* BOTTOM LEGAL BAR */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative pb-4">
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                        <p className="text-[10px] font-mono font-bold text-text-secondary opacity-40 uppercase tracking-[0.2em]">
                            © {new Date().getFullYear()} TECH_NEST_OS // BUILD_2026.4
                        </p>
                        <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                            <Link to="/privacy" className="hover:text-hyper-cyan transition-colors">Privacy_Log</Link>
                            <Link to="/terms" className="hover:text-hyper-cyan transition-colors">Usage_Terms</Link>
                        </div>
                    </div>
                    
                    {/* SCROLL TO TOP */}
                    <button 
                        onClick={scrollToTop}
                        className="p-4 bg-bg-card border border-border-color hover:border-hyper-cyan/50 hover:text-hyper-cyan text-text-secondary rounded-2xl flex items-center justify-center transition-all group shadow-premium-sm hover:shadow-premium-md active:scale-95"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ to, children, highlight = false }) {
    return (
        <li>
            <Link 
                to={to} 
                className={`text-[13px] font-bold tracking-tight transition-all duration-300 flex items-center gap-2 group/link ${highlight ? 'text-hyper-cyan italic' : 'text-text-secondary hover:text-text-primary'}`}
            >
                <span className="w-0 h-[2px] bg-hyper-cyan rounded-full group-hover/link:w-3 transition-all duration-300" />
                {children}
            </Link>
        </li>
    );
}

function SocialIcon({ icon: Icon, href }) {
    return (
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-bg-card border border-border-color flex items-center justify-center text-text-secondary hover:bg-hyper-cyan hover:text-black hover:border-hyper-cyan transition-all hover:scale-110 active:scale-90 shadow-sm"
        >
            <Icon size={18} />
        </a>
    );
}
