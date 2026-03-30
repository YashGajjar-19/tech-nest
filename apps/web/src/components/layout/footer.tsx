import Link from "next/link";
import { Twitter, Github } from "lucide-react";

/* ──────────────────────────────────────────────────────────────
   FOOTER
   "The Breath" — generous whitespace, center column
   Mathematical 8pt rhythm: 48px section gaps, 16px item gaps
   ────────────────────────────────────────────────────────────── */

const platformLinks = [
  { href: "/phones", label: "Phones" },
  { href: "/compare", label: "Compare" },
  { href: "/news", label: "News" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-(--divider) pt-16 pb-8">
      <div className="center-col">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo & Tagline */}
          <div className="col-span-1 flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-(--text-primary) font-(family-name:--font-geist-sans)"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-(--accent)">
                <span className="text-[10px] font-bold text-white">TN</span>
              </div>
              Tech Nest
            </Link>
            <p className="text-[13px] leading-[22px] text-(--text-secondary) max-w-[240px]">
              Compare phones, read curated news, and get AI-powered
              recommendations.
            </p>
          </div>

          {/* Link Columns */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-8">
            <FooterLinkGroup title="Platform" links={platformLinks} />
            <FooterLinkGroup title="Company" links={companyLinks} />
            <div className="col-span-2 lg:col-span-1">
              <FooterLinkGroup title="Legal" links={legalLinks} />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-(--divider) gap-4">
          <p className="text-[12px] text-(--text-muted) font-(family-name:--font-geist-sans)">
            &copy; {currentYear} Tech Nest. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <SocialLink href="https://twitter.com" label="Twitter">
              <Twitter className="h-[15px] w-[15px]" strokeWidth={1.25} />
            </SocialLink>
            <SocialLink href="https://github.com" label="GitHub">
              <Github className="h-[15px] w-[15px]" strokeWidth={1.25} />
            </SocialLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Sub-components ── */

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="tn-label">{title}</h4>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-[13px] text-(--text-secondary) transition-colors duration-150 hover:text-(--text-primary)"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-(--text-muted) transition-all duration-150 hover:text-(--text-secondary) hover:bg-(--accent-subtle)"
    >
      <span className="sr-only">{label}</span>
      {children}
    </Link>
  );
}
