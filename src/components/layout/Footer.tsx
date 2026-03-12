import { Container } from "@/components/ui/container";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-primary mt-20">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-text-primary mb-4">Tech Nest.</h3>
            <p className="text-sm text-text-secondary max-w-xs">
              The world's most intelligent device discovery and comparison engine.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/discover" className="hover:text-text-primary transition-colors">Discover</Link></li>
              <li><Link href="/compare" className="hover:text-text-primary transition-colors">Compare Matrix</Link></li>
              <li><Link href="/decision" className="hover:text-text-primary transition-colors">Decision AI</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/phones" className="hover:text-text-primary transition-colors">Phones</Link></li>
              <li><Link href="/laptops" className="hover:text-text-primary transition-colors">Laptops</Link></li>
              <li><Link href="/audio" className="hover:text-text-primary transition-colors">Audio</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-4">More</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/api-docs" className="hover:text-text-primary transition-colors">API & Devs</Link></li>
              <li><Link href="/about" className="hover:text-text-primary transition-colors">About</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-secondary">
          <p>© {new Date().getFullYear()} Tech Nest. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-text-primary">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
