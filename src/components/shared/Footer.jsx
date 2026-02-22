import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Instagram, Youtube, ArrowUp } from "lucide-react";

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-black border-t border-white/10 text-neutral-400 font-sans mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 mb-16">
                    
                    {/* COLUMN 1 - BRAND */}
                    <div className="lg:w-1/4 space-y-6 flex flex-col items-start pr-4">
                        <Link to="/" className="flex items-center gap-2 group w-fit">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-hyper-cyan to-blue-500 flex items-center justify-center text-black font-black text-xl shadow-[0_0_15px_rgba(0,255,204,0.3)] group-hover:shadow-[0_0_25px_rgba(0,255,204,0.6)] transition-all duration-300">
                                T
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">Tech Nest</span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs text-neutral-400">
                            Discover Technology Smarter.<br/>
                            The ultimate platform to explore, compare, and learn about the future of tech.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:w-3/4 gap-8">
                        {/* COLUMN 2 - DEVICES */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Devices</h4>
                            <ul className="space-y-4 text-sm">
                                <FooterLink to="/category/phones">Phones</FooterLink>
                                <FooterLink to="/category/laptops">Laptops</FooterLink>
                                <FooterLink to="/category/tablets">Tablets</FooterLink>
                                <FooterLink to="/category/watches">Smart Watches</FooterLink>
                                <FooterLink to="/category/audio">Earbuds & Audio</FooterLink>
                                <FooterLink to="/category/displays">Smart TVs</FooterLink>
                                <FooterLink to="/compare" special>Compare Devices</FooterLink>
                            </ul>
                        </div>

                        {/* COLUMN 3 - RESOURCES */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Resources</h4>
                            <ul className="space-y-4 text-sm">
                                <FooterLink to="/news">Latest News</FooterLink>
                                <FooterLink to="/reviews">Expert Reviews</FooterLink>
                                <FooterLink to="/guides">Buying Guides</FooterLink>
                                <FooterLink to="/trending">Best Devices</FooterLink>
                                <FooterLink to="/ai-compare" special>AI Comparison</FooterLink>
                            </ul>
                        </div>

                        {/* COLUMN 4 - COMPANY */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Company</h4>
                            <ul className="space-y-4 text-sm">
                                <FooterLink to="/about">About Us</FooterLink>
                                <FooterLink to="/contact">Contact</FooterLink>
                                <FooterLink to="/privacy">Privacy Policy</FooterLink>
                                <FooterLink to="/terms">Terms of Service</FooterLink>
                                <li className="text-neutral-500 flex items-center gap-2">
                                    Careers <span className="text-[10px] py-0.5 px-2 rounded-full border border-white/10 bg-white/5">Hiring Soon</span>
                                </li>
                            </ul>
                        </div>

                        {/* COLUMN 5 - SOCIAL & NEWSLETTER */}
                        <div className="col-span-2 md:col-span-1">
                            <h4 className="text-white font-semibold mb-6">Community</h4>
                            <div className="flex flex-wrap items-center gap-3 mb-8">
                                <SocialIcon icon={Github} href="https://github.com" />
                                <SocialIcon icon={Twitter} href="https://twitter.com" />
                                <SocialIcon icon={Instagram} href="https://instagram.com" />
                                <SocialIcon icon={Youtube} href="https://youtube.com" />
                                <SocialIcon icon={Linkedin} href="https://linkedin.com" />
                            </div>
                            
                            <div className="space-y-3">
                                <p className="text-sm">Subscribe to our newsletter</p>
                                <div className="flex p-1 rounded-full border border-white/10 bg-white/5 focus-within:border-hyper-cyan/50 focus-within:bg-white/10 transition-colors max-w-[280px]">
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        className="bg-transparent border-none outline-none px-4 text-sm w-full text-white placeholder:text-neutral-600 focus:ring-0"
                                    />
                                    <button className="bg-white/10 hover:bg-hyper-cyan hover:text-black transition-colors rounded-full px-4 py-2 text-sm font-medium text-white shrink-0">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* BOTTOM BAR */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 relative">
                    <p className="text-sm">
                        © {new Date().getFullYear()} Tech Nest. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-sm">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                    
                    {/* SCROLL TO TOP */}
                    <button 
                        onClick={scrollToTop}
                        className="absolute right-0 -top-6 bg-black border border-white/10 hover:border-hyper-cyan hover:text-hyper-cyan text-white/50 w-12 h-12 rounded-full flex items-center justify-center transition-all group shadow-lg"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ to, children, special = false }) {
    return (
        <li>
            <Link 
                to={to} 
                className={`relative group inline-flex hover:text-white transition-colors ${special ? 'text-hyper-cyan hover:text-hyper-cyan/80' : ''}`}
            >
                {children}
                <span className={`absolute -bottom-1 left-0 w-0 h-px rounded-full transition-all duration-300 group-hover:w-full ${special ? 'bg-hyper-cyan/50' : 'bg-white/50'}`} />
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
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-hyper-cyan hover:text-black hover:border-hyper-cyan transition-all hover:scale-110"
        >
            <Icon size={18} />
        </a>
    );
}