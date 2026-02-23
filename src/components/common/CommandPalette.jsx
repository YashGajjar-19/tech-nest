import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, Smartphone, Newspaper, ArrowRight, Sparkles, Bot, Zap } from "lucide-react";
import { useCommand } from "@/context/CommandContext";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

// Simulating FastAPI Backend Search
const performSearch = async (query) => {
    // In production, this hits: await fetch(`http://localhost:8000/ai/chat`, { method: "POST", body: { query } })
    return new Promise((resolve) => {
        setTimeout(() => {
            const lowerQ = query.toLowerCase();
            
            // Mock AI Response
            let aiResponse = null;
            if (lowerQ.includes("best") || lowerQ.includes("vs") || lowerQ.includes("compare") || lowerQ.length > 5) {
                aiResponse = {
                    text: `Based on expert analysis for "${query}", we recommend top-tier devices with superior performance. The Samsung Galaxy S24 Ultra and iPhone 15 Pro Max currently stand out in our database for these requirements.`,
                    intent: lowerQ.includes("vs") || lowerQ.includes("compare") ? "comparison" : "recommendation",
                };
            }

            const mockDB = [
                { id: 1, type: "device", title: "Samsung Galaxy S24 Ultra", slug: "samsung-s24" },
                { id: 2, type: "device", title: "iPhone 15 Pro Max", slug: "iphone-15-pro-max" },
                { id: 3, type: "device", title: "Pixel 8 Pro", slug: "pixel-8-pro" },
                { id: 4, type: "article", title: "Best Gaming Phones under $500", slug: "gaming-phones" },
                { id: 5, type: "comparison", title: "Compare: S24 Ultra vs iPhone 15 Pro Max", slug: "iphone-vs-samsung" }
            ];
            
            resolve({
                ai: aiResponse,
                items: mockDB.filter(item => item.title.toLowerCase().includes(lowerQ.split(' ')[0]) || lowerQ.length > 5).slice(0, 3) 
            });
        }, 800); // simulate AI thinking time
    });
};

export default function CommandPalette() {
    const { isOpen, setIsOpen } = useCommand();
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState({ ai: null, items: [] });
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) {
            setQuery("");
            setResults({ ai: null, items: [] });
        }
    }, [isOpen]);

    useEffect(() => {
        if (!query.trim()) {
            setResults({ ai: null, items: [] });
            return;
        }

        let isMounted = true;
        setLoading(true);
        
        const fetchResults = async () => {
            try {
                const data = await performSearch(query);
                if (isMounted) {
                    setResults(data);
                }
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        const debounce = setTimeout(fetchResults, 400); // Slightly longer debounce for AI queries
        return () => {
            isMounted = false;
            clearTimeout(debounce);
        };
    }, [query]);

    if (!isOpen) return null;

    const handleSelect = (item) => {
        setIsOpen(false);
        if (item.type === "device") {
            navigate(`/devices/${item.slug}`);
        } else {
            // handle other types navigation
            navigate(`/`);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
            <div 
                className="absolute inset-0 bg-bg-main/80 backdrop-blur-md" 
                onClick={() => setIsOpen(false)} 
            />
            
            <div className="relative w-full max-w-3xl bg-bg-card border border-border-color rounded-2xl shadow-premium-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <Command 
                    loop
                    className="flex flex-col h-full max-h-[80vh]"
                    shouldFilter={false} // We filter entirely via API (mocked above)
                >
                    {/* INPUT HEADER */}
                    <div className="flex items-center px-5 py-5 border-b border-border-color bg-bg-main relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-hyper-cyan/5 via-transparent to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
                        <Bot className="w-6 h-6 text-hyper-cyan mr-4 shrink-0 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                        <Command.Input 
                            autoFocus
                            value={query}
                            onValueChange={setQuery}
                            placeholder="Ask Tech Nest AI (e.g., 'Best gaming phone under 40K')..."
                            className="flex-1 bg-transparent text-text-primary placeholder:text-text-secondary/50 focus:outline-none text-xl relative z-10 font-medium"
                        />
                        {loading && (
                            <div className="flex gap-1.5 items-center shrink-0 ml-4 relative z-10">
                                <span className="w-1.5 h-1.5 bg-hyper-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-hyper-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-hyper-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        )}
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="px-2 py-1 ml-4 text-[10px] font-bold tracking-widest uppercase border border-border-color rounded bg-bg-card text-text-secondary hover:text-text-primary transition-colors relative z-10"
                        >
                            ESC
                        </button>
                    </div>

                    {/* RESULTS AREA */}
                    <Command.List className="overflow-y-auto p-2 no-scrollbar min-h-[150px]">
                        {!loading && query && results.items.length === 0 && !results.ai && (
                            <Command.Empty className="py-16 text-center text-text-secondary">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-bg-main border border-border-color mb-4">
                                    <Bot className="w-6 h-6 text-text-secondary opacity-50" />
                                </div>
                                <p className="text-base text-text-primary">No insights found for <span className="font-mono text-hyper-cyan">"{query}"</span></p>
                                <p className="text-sm mt-2 opacity-60">Try asking our AI about specific features, like "phones with best battery"</p>
                            </Command.Empty>
                        )}

                        {results.ai && !loading && (
                            <div className="px-5 py-4 m-2 bg-gradient-to-br from-hyper-cyan/10 to-transparent border border-hyper-cyan/20 rounded-xl relative overflow-hidden group shadow-lg">
                                <div className="absolute top-0 left-0 w-1 h-full bg-hyper-cyan shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-hyper-cyan/20 p-1.5 rounded-md">
                                                <Sparkles className="w-4 h-4 text-hyper-cyan" />
                                            </div>
                                            <span className="text-xs font-bold text-hyper-cyan uppercase tracking-widest">Tech Nest Intelligence</span>
                                        </div>
                                        {results.ai.intent && (
                                            <span className="text-[9px] px-2 py-1 rounded-full border border-hyper-cyan/30 bg-hyper-cyan/5 text-hyper-cyan uppercase font-bold tracking-widest">
                                                {results.ai.intent}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[15px] text-text-primary leading-relaxed font-medium">
                                        {results.ai.text}
                                    </p>
                                    <div className="flex gap-4 mt-2 pt-3 border-t border-hyper-cyan/10">
                                        <button className="text-xs font-semibold flex items-center gap-1.5 text-text-secondary hover:text-hyper-cyan transition-colors group/btn">
                                            <Zap className="w-3.5 h-3.5 group-hover/btn:text-hyper-cyan" /> View Deep Analysis
                                        </button>
                                        <button className="text-xs font-semibold flex items-center gap-1.5 text-text-secondary hover:text-white transition-colors">
                                            Auto-Compare Top Picks
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {results.items.length > 0 && !loading && (
                            <Command.Group heading="RECOMMENDED RESOURCES" className="**:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:pt-4 **:[[cmdk-group-heading]]:pb-2 **:[[cmdk-group-heading]]:text-[10px] **:[[cmdk-group-heading]]:font-bold **:[[cmdk-group-heading]]:text-text-secondary/70 **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-widest">
                                {results.items.map((item) => (
                                    <Command.Item
                                        key={`${item.type}-${item.id}`}
                                        value={item.title}
                                        onSelect={() => handleSelect(item)}
                                        className={twMerge(
                                            clsx(
                                                "flex items-center gap-4 px-4 py-3 mx-1 mb-1 rounded-xl cursor-pointer group transition-all duration-200 outline-none",
                                                "aria-selected:bg-bg-main aria-selected:border-border-color aria-selected:shadow-md",
                                                "hover:bg-bg-main hover:shadow-sm"
                                            )
                                        )}
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-bg-card border border-border-color flex items-center justify-center shrink-0 group-aria-selected:border-hyper-cyan/50 group-aria-selected:bg-hyper-cyan/5 transition-all">
                                            {item.type === 'device' ? (
                                                <Smartphone size={18} className="text-text-secondary group-aria-selected:text-hyper-cyan" />
                                            ) : (
                                                <Newspaper size={18} className="text-text-secondary group-aria-selected:text-hyper-cyan" />
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col flex-1">
                                            <span className="font-bold text-sm text-text-primary group-aria-selected:text-hyper-cyan transition-colors">{item.title}</span>
                                            <span className="text-[10px] uppercase tracking-wider text-text-secondary mt-0.5">{item.type}</span>
                                        </div>

                                        <ArrowRight size={16} className="text-text-secondary opacity-0 -translate-x-2 group-aria-selected:opacity-100 group-aria-selected:translate-x-0 transition-all duration-300" />
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}
                    </Command.List>

                    {/* FOOTER SHORTCUTS */}
                    <div className="px-5 py-3 border-t border-border-color bg-bg-main/50 flex flex-wrap items-center justify-between gap-4 mt-auto">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                            <Bot className="w-3.5 h-3.5" />
                            <span>Tech Nest AI Platform v1.0</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium text-text-secondary">
                            <span className="flex items-center gap-1.5 opacity-70">
                                <kbd className="bg-bg-card border border-border-color px-1.5 py-0.5 rounded text-[10px] shadow-sm font-sans">↑</kbd>
                                <kbd className="bg-bg-card border border-border-color px-1.5 py-0.5 rounded text-[10px] shadow-sm font-sans">↓</kbd>
                                Navigate
                            </span>
                            <span className="flex items-center gap-1.5 opacity-70">
                                <kbd className="bg-bg-card border border-border-color px-1.5 py-0.5 rounded text-[10px] shadow-sm font-sans">↵</kbd>
                                Select
                            </span>
                        </div>
                    </div>
                </Command>
            </div>
        </div>
    );
}