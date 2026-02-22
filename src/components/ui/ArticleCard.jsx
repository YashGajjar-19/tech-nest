import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, ArrowUpRight } from "lucide-react";

export default function ArticleCard({ article, featured = false }) {
    if (!article) return null;

    return (
        <article 
            className={`group relative flex flex-col justify-between overflow-hidden rounded-4xl bg-bg-card/40 backdrop-blur-md border border-border-color hover:border-hyper-cyan/30 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-premium-xl ${featured ? 'md:flex-row md:col-span-2 lg:col-span-3 min-h-[400px]' : 'h-full'}`}
        >
            {/* Image Container */}
            <div className={`relative overflow-hidden ${featured ? 'md:w-1/2 lg:w-3/5 h-64 md:h-auto shrink-0' : 'aspect-16/10 shrink-0'}`}>
                <div className="absolute inset-0 bg-bg-main/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img 
                    src={article.image_url || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop"} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                />
                
                {/* Category Badge on Image */}
                <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-bg-main bg-text-primary/95 backdrop-blur-md rounded-full shadow-sm">
                        {article.category}
                    </span>
                </div>
            </div>

            {/* Content Container */}
            <div className={`flex flex-col flex-1 p-6 ${featured ? 'md:p-8 lg:p-10 justify-center' : 'justify-between'}`}>
                <div>
                    <div className="flex items-center gap-3 text-xs font-medium text-text-secondary mb-4">
                        <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {article.time}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border-color" />
                        <span>{article.author}</span>
                    </div>

                    <h3 className={`font-semibold tracking-tight text-text-primary group-hover:text-hyper-cyan transition-colors line-clamp-2 ${featured ? 'text-2xl md:text-3xl lg:text-4xl mb-4 leading-tight' : 'text-lg mb-3 leading-snug'}`}>
                        {article.title}
                    </h3>
                    
                    <p className={`text-text-secondary line-clamp-3 ${featured ? 'text-base md:text-lg opacity-80 mb-8 max-w-xl' : 'text-sm opacity-70 mb-6'}`}>
                        {article.excerpt}
                    </p>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-border-color/50">
                    <span className="text-sm font-semibold text-text-primary flex items-center gap-2 group-hover:text-hyper-cyan transition-colors">
                        Read Story 
                    </span>
                    <div className="w-8 h-8 rounded-full bg-bg-main border border-border-color flex items-center justify-center text-text-secondary group-hover:bg-hyper-cyan/10 group-hover:text-hyper-cyan group-hover:border-hyper-cyan/30 transition-all">
                        <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                </div>
            </div>
            
            {/* Click target helper */}
            <Link to={`/news/${article.slug}`} className="absolute inset-0 z-30">
                <span className="sr-only">Read {article.title}</span>
            </Link>
        </article>
    );
}
