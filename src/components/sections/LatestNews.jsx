import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Newspaper } from "lucide-react";
import ArticleCard from "@/components/ui/ArticleCard";

const MOCK_ARTICLES = [
    {
        id: "feat-1",
        title: "Apple Intelligence: The silent transition that changed smartphones forever.",
        excerpt: "While competitors raced for raw specs, Apple quietly built an integrated edge-AI ecosystem that redefines how we interact with mobile hardware.",
        category: "Deep Dive",
        image_url: "https://images.unsplash.com/photo-1621360841013-c76831f13b57?q=80&w=1200&auto=format&fit=crop",
        time: "4 hours ago",
        author: "Alex Rivera",
        slug: "apple-intelligence-transition"
    },
    {
        id: "news-1",
        title: "Snapdragon 8 Gen 5 Benchmarks leak early, showing 40% thermal improvement.",
        excerpt: "Early test units reveal Qualcomm's new architecture might finally solve the sustained performance issue.",
        category: "News",
        image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
        time: "6 hours ago",
        author: "Sarah Chen",
        slug: "snapdragon-8-gen-5-leak"
    },
    {
        id: "review-1",
        title: "Samsung Galaxy S25 Ultra Long-Term Review: The completely refined slab.",
        excerpt: "After 3 months of daily use, we analyze if Samsung's flagship justifies its premium price tag.",
        category: "Review",
        image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop",
        time: "12 hours ago",
        author: "Marcus Doe",
        slug: "s25-ultra-review"
    },
    {
        id: "guide-1",
        title: "Best Gaming Phones under ₹40,000 (Spring 2026 Edition)",
        excerpt: "Thermal throttling is the real enemy. Here are the devices that actually maintain 60fps.",
        category: "Guide",
        image_url: "https://images.unsplash.com/photo-1598327105666-5b89351cb31b?q=80&w=600&auto=format&fit=crop",
        time: "1 day ago",
        author: "Priya Sharma",
        slug: "best-gaming-phones-40k"
    }
];

export default function LatestNews() {
    const featuredArticle = MOCK_ARTICLES[0];
    const gridArticles = MOCK_ARTICLES.slice(1);

    return (
        <section className="relative py-24 md:py-32 bg-bg-main overflow-hidden border-t border-border-color/50" id="news-layout">
            {/* Subtle background element */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-hyper-cyan/5 via-bg-main to-transparent opacity-50 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 text-text-secondary font-medium text-sm mb-4 uppercase tracking-wider"
                        >
                            <Newspaper size={16} className="text-hyper-cyan" />
                            <span>Editorial</span>
                        </motion.div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-text-primary mb-4"
                        >
                            Latest Intelligence
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg text-text-secondary max-w-xl"
                        >
                            Deep dives, trusted reviews, and industry analysis. Stay ahead of the technology curve.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Link 
                            to="/news" 
                            className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary px-6 py-3 rounded-full border border-border-color bg-bg-card hover:bg-bg-main hover:border-hyper-cyan/30 transition-all group shrink-0 shadow-sm"
                        >
                            View All Intel
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Featured Article (spans multiple columns depending on breakpoint) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="md:col-span-2 lg:col-span-3"
                    >
                        <ArticleCard article={featuredArticle} featured={true} />
                    </motion.div>

                    {/* Standard Articles Grid */}
                    {gridArticles.map((article, i) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                            className="h-full"
                        >
                            <ArticleCard article={article} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
