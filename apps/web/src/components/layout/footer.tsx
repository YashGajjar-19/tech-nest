import Link from "next/link";
import { Twitter, Github } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--divider)] bg-[var(--bg-primary)] pt-16 pb-8">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo & Tagline */}
          <div className="col-span-1 flex flex-col gap-4">
            <Link
              href="/"
              className="text-[16px] font-medium text-[var(--accent)] font-[family-name:var(--font-display)]"
            >
              Tech Nest
            </Link>
            <p className="text-[13px] leading-[20px] text-[var(--text-secondary)] max-w-[240px]">
              Compare phones, read news, and get AI-powered recommendations.
            </p>
          </div>

          {/* Links */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <h4 className="tn-label">Platform</h4>
              {[
                { href: "/phones", label: "Phones" },
                { href: "/compare", label: "Compare" },
                { href: "/news", label: "News" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] text-[var(--text-secondary)] transition-colors duration-[120ms] hover:text-[var(--text-primary)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="tn-label">Company</h4>
              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] text-[var(--text-secondary)] transition-colors duration-[120ms] hover:text-[var(--text-primary)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3 col-span-2 lg:col-span-1">
              <h4 className="tn-label">Legal</h4>
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] text-[var(--text-secondary)] transition-colors duration-[120ms] hover:text-[var(--text-primary)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[var(--divider)] gap-4">
          <p className="text-[13px] text-[var(--text-tertiary)]">
            &copy; {currentYear} Tech Nest. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-tertiary)] transition-colors duration-[120ms] hover:text-[var(--text-secondary)]"
            >
              <span className="sr-only">Twitter</span>
              <Twitter className="h-[16px] w-[16px]" />
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-tertiary)] transition-colors duration-[120ms] hover:text-[var(--text-secondary)]"
            >
              <span className="sr-only">GitHub</span>
              <Github className="h-[16px] w-[16px]" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
