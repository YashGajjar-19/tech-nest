import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Clock, Star, Bookmark } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getRecentlyViewed, getRecommendations, getSavedDevicesSummary } from "@/services/apiPersonalization";

import DeviceCard from "@/components/ui/DeviceCard";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";

export default function PersonalizedFeed() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [recent, setRecent] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [saved, setSaved] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        async function fetchPersonalizedData() {
            setLoading(true);
            try {
                const [r, rec, s] = await Promise.all([
                    getRecentlyViewed(user.id, 5),
                    getRecommendations(user.id),
                    getSavedDevicesSummary(user.id, 5)
                ]);
                setRecent(r);
                setRecommended(rec);
                setSaved(s);
            } catch (error) {
                console.error("Failed to load personalized feed", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPersonalizedData();
    }, [user]);

    if (!user) return null; // Don't show anything for anonymous users handled by Home component
    
    // In Level 1, if no data exists at all across all 3, we don't show the section.
    if (!loading && recent.length === 0 && recommended.length === 0 && saved.length === 0) {
        return null;
    }

    const FeedRow = ({ title, icon, items, fallback }) => {
        if (!items || items.length === 0) return null;
        
        return (
            <div className="mb-12 last:mb-0">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl md:text-2xl font-semibold flex items-center gap-2 text-text-primary">
                        <span className="text-brand">{icon}</span>
                        {title}
                    </h4>
                    <Link to="/profile" className="text-sm font-medium text-text-secondary hover:text-text-primary flex items-center gap-1 group transition-colors">
                        View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                <div className="relative -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto scrollbar-hide pb-6">
                    <div className="flex gap-4 sm:gap-6 w-max items-stretch">
                        {items.map((product, i) => (
                            <div key={product.id} className="w-[75vw] sm:w-[300px] lg:w-[280px] shrink-0">
                                <DeviceCard 
                                    product={product} 
                                    onToggle={() => navigate(`/devices/${product.slug}`)} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Section className="relative bg-bg-main overflow-hidden py-12 border-b border-border-color">
            <Container>
                {/* WELCOME MESSAGE */}
                <div className="mb-10 lg:mb-16">
                    <motion.h3 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl lg:text-5xl font-semibold tracking-tight text-text-primary flex flex-wrap items-center gap-3"
                    >
                        Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''} 
                        <span className="inline-block animate-wave text-4xl lg:text-5xl">👋</span>
                    </motion.h3>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-text-secondary mt-2 text-base lg:text-lg"
                    >
                        Your personalized tech discovery feed.
                    </motion.p>
                </div>

                {loading ? (
                    <div className="space-y-12">
                         <div className="h-[300px] bg-bg-card rounded-3xl animate-pulse" />
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <FeedRow title="Recently Viewed" icon={<Clock size={20} />} items={recent} />
                        <FeedRow title="Recommended For You" icon={<Star size={20} />} items={recommended} />
                        <FeedRow title="Saved Devices" icon={<Bookmark size={20} />} items={saved} />
                    </div>
                )}
            </Container>
            
             <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes wave {
                    0% { transform: rotate(0.0deg) }
                    10% { transform: rotate(14.0deg) }
                    20% { transform: rotate(-8.0deg) }
                    30% { transform: rotate(14.0deg) }
                    40% { transform: rotate(-4.0deg) }
                    50% { transform: rotate(10.0deg) }
                    60% { transform: rotate(0.0deg) }
                    100% { transform: rotate(0.0deg) }
                }
                .animate-wave {
                    animation: wave 2s infinite;
                    transform-origin: 70% 70%;
                }
            `}</style>
        </Section>
    );
}
