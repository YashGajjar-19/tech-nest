import { Container } from "@/components/ui/container"

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
              <li><a href="/discover" className="hover:text-text-primary transition-colors">Discover</a></li>
              <li><a href="/compare" className="hover:text-text-primary transition-colors">Compare Matrix</a></li>
              <li><a href="/decision" className="hover:text-text-primary transition-colors">Decision AI</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="/phones" className="hover:text-text-primary transition-colors">Phones</a></li>
              <li><a href="/laptops" className="hover:text-text-primary transition-colors">Laptops</a></li>
              <li><a href="/audio" className="hover:text-text-primary transition-colors">Audio</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-4">More</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="/api-docs" className="hover:text-text-primary transition-colors">API & Devs</a></li>
              <li><a href="/about" className="hover:text-text-primary transition-colors">About</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-secondary">
          <p>© {new Date().getFullYear()} Tech Nest. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-text-primary">Privacy Policy</a>
            <a href="/terms" className="hover:text-text-primary">Terms of Service</a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
