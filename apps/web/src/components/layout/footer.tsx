import Link from "next/link";
import { Twitter, Github } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-tn-border bg-tn-surface pt-12 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Tagline */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="tn-h4 text-tn-accent truncate">
              Tech Nest
            </Link>
            <p className="tn-body-sm text-tn-text-secondary pr-4">
              Compare phones, read news, and get AI-powered recommendations with an editorial-tech aesthetic.
            </p>
          </div>

          {/* Links */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <h4 className="tn-label">Platform</h4>
              <Link href="/phones" className="tn-body-sm text-tn-text-secondary hover:text-tn-accent transition-colors">Phones</Link>
              <Link href="/compare" className="tn-body-sm text-tn-text-secondary hover:text-tn-accent transition-colors">Compare</Link>
              <Link href="/news" className="tn-body-sm text-tn-text-secondary hover:text-tn-accent transition-colors">News</Link>
            </div>
            
            <div className="flex flex-col gap-3">
              <h4 className="tn-label">Company</h4>
              <Link href="/about" className="tn-body-sm text-tn-text-secondary hover:text-tn-accent transition-colors">About</Link>
              <Link href="/contact" className="tn-body-sm text-tn-text-secondary hover:text-tn-accent transition-colors">Contact</Link>
            </div>

            <div className="flex flex-col gap-3 col-span-2 lg:col-span-1">
              <h4 className="tn-label">Legal</h4>
              <Link href="/privacy" className="tn-body-sm text-tn-text-secondary hover:text-tn-accent transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="tn-body-sm text-tn-text-secondary hover:text-tn-accent transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-tn-border-subtle gap-4">
          <p className="tn-body-sm text-tn-text-muted">
            &copy; {currentYear} Tech Nest. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-tn-text-secondary hover:text-tn-accent transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-tn-text-secondary hover:text-tn-accent transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
