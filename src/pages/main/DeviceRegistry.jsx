import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowDownAZ, Star, Clock, Filter, X } from 'lucide-react';
import { getProducts } from '@/services/apiDevices';
import { motion, AnimatePresence } from 'framer-motion';

import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import DeviceCard from '@/components/ui/DeviceCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import CardSkeleton from '@/components/skeleton/CardSkeleton';

const BRANDS = ["Apple", "Samsung", "Google", "OnePlus", "Sony"];

export default function DeviceRegistry() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialQuery = searchParams.get('q') || '';
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters & Sorting state
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [activeBrand, setActiveBrand] = useState("All");
    const [sortBy, setSortBy] = useState("latest");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        getProducts().then((data) => {
            setProducts(data || []);
            setLoading(false);
        });
    }, []);

    // Filter logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              product.model_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBrand = activeBrand === "All" || product.brands?.name === activeBrand;
        return matchesSearch && matchesBrand;
    });

    // Sort logic
    const displayProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'latest') {
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
        if (sortBy === 'name') {
            return (a.name || '').localeCompare(b.name || '');
        }
        return 0; // Default or popular
    });

    return (
        <Section className="pt-8 pb-32">
            <Container>
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
                    <div className="max-w-2xl">
                        <h1 className="text-h1 font-black tracking-tight mb-4">Device Registry</h1>
                        <p className="text-lg text-text-secondary leading-relaxed">
                            Search, filter, and discover the exact specifications for thousands of global technology devices.
                        </p>
                    </div>
                </div>

                {/* SEARCH & FILTER BAR */}
                <div className="flex flex-col md:flex-row gap-4 mb-10 relative z-20">
                    <div className="flex-1 relative">
                        <Input 
                            placeholder="Find any device, brand, or spec..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setSearchParams({ q: e.target.value });
                            }}
                            leftIcon={<Search size={18} className="text-text-muted" />}
                            className="bg-bg-surface/50 border-border-subtle hover:border-border-color focus:bg-bg-main"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none h-12 px-5 pr-12 rounded-xl bg-bg-surface border border-border-subtle text-sm font-medium text-text-primary focus:outline-none focus:border-brand cursor-pointer"
                            >
                                <option value="latest">Latest Drops</option>
                                <option value="popular">Most Popular</option>
                                <option value="name">Alphabetical</option>
                            </select>
                            <ArrowDownAZ size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        </div>
                        
                        <Button 
                            variant="secondary" 
                            className="h-12 border-border-subtle md:hidden"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            leftIcon={<Filter size={18} />}
                        >
                            Filters
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* SIDEBAR FILTERS (Desktop) */}
                    <div className={`lg:w-64 shrink-0 flex flex-col gap-8 ${isFilterOpen ? 'block' : 'hidden lg:flex'}`}>
                        <div className="flex items-center justify-between lg:hidden mb-2">
                            <h3 className="font-bold text-lg">Filters</h3>
                            <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-white/5 rounded-full"><X size={16}/></button>
                        </div>
                        
                        {/* Brand Filter */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                                <SlidersHorizontal size={14} /> Brand
                            </h4>
                            <div className="flex flex-col gap-2">
                                <FilterCheckbox 
                                    label="All Brands" 
                                    active={activeBrand === "All"} 
                                    onClick={() => setActiveBrand("All")} 
                                />
                                {BRANDS.map(brand => (
                                    <FilterCheckbox 
                                        key={brand} 
                                        label={brand} 
                                        active={activeBrand === brand} 
                                        onClick={() => setActiveBrand(brand)} 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Additional mockup filters can go here */}
                    </div>

                    {/* MAIN GRID */}
                    <div className="flex-1">
                        {/* Results Count Summary */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm font-medium text-text-secondary">
                                Showing <span className="text-text-primary font-bold">{displayProducts.length}</span> devices
                            </p>
                            {searchQuery && (
                                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-white/5" onClick={() => {setSearchQuery(''); setSearchParams({});}}>
                                    Clear Search <X size={12} className="ml-1 inline" />
                                </Badge>
                            )}
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1,2,3,4,5,6].map(i => <CardSkeleton key={i} />)}
                            </div>
                        ) : displayProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border-subtle rounded-3xl bg-bg-surface/30">
                                <Search size={48} className="text-text-muted mb-4 opacity-50" />
                                <h3 className="text-xl font-bold text-text-primary mb-2">No devices found</h3>
                                <p className="text-text-secondary max-w-sm">We couldn't find any devices matching "{searchQuery}". Try a different term or clearing your filters.</p>
                                <Button className="mt-6" variant="secondary" onClick={() => {setSearchQuery(''); setActiveBrand("All");}}>
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            <motion.div 
                                layout
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                            >
                                <AnimatePresence mode="popLayout">
                                    {displayProducts.map((product, i) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3, delay: i * 0.05 }}
                                            key={product.id}
                                            className="flex" // force stretch
                                        >
                                            <DeviceCard 
                                                product={product}
                                                onToggle={() => navigate(`/devices/${product.slug}`)} 
                                                score={92 - (i % 10)} 
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                </div>
            </Container>
        </Section>
    );
}

function FilterCheckbox({ label, active, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-200 outline-none w-full text-left ${
                active ? 'bg-brand/10 text-brand' : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
            }`}
        >
            <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                active ? 'border-brand bg-brand text-bg-main' : 'border-border-color bg-transparent'
            }`}>
                {active && <motion.div layoutId="check" className="w-2 h-2 rounded-[2px] bg-bg-main" />}
            </div>
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
}
