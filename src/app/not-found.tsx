import Link from "next/link";
import { AlertCircle, ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 selection:bg-surface-elevated/50 bg-bg-primary">
      <div className="relative w-full max-w-md mx-auto text-center flex flex-col items-center">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="w-20 h-20 bg-surface border border-border-subtle rounded-3xl flex items-center justify-center mb-8 shadow-sm relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <AlertCircle className="w-10 h-10 text-text-secondary" />
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-text-primary mb-4 relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-both">
          404
        </h1>
        
        <p className="text-xl md:text-2xl text-text-secondary font-light mb-12 relative z-10 max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
          We couldn't find the page you're looking for.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 fill-mode-both">
          <Link
            href="/"
            className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-text-primary text-bg-primary rounded-full font-medium hover:bg-surface transition-colors shadow-sm group"
          >
            <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Return Home
          </Link>
          
          <Link
            href="/search"
            className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-surface border border-border-subtle text-text-primary rounded-full font-medium hover:border-text-secondary transition-colors group"
          >
            <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform text-text-secondary" />
            Search Devices
          </Link>
        </div>
        
        <div className="mt-16 text-sm text-text-secondary/60 animate-in fade-in duration-1000 delay-500 fill-mode-both">
          If you believe this is an error, please contact support.
        </div>
      </div>
    </div>
  );
}
