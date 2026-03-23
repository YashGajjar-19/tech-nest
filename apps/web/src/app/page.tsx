import Link from "next/link";
import { ArrowRight, Smartphone, BarChart3, Zap } from "lucide-react";

/* ──────────────────────────────────────────────────────────────
   HOME PAGE
   Feeling: quiet · exploratory · focused
   
   Layout: Hero → Value Props → CTA
   No visual noise. User understands purpose in 5 seconds.
   ────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* ── Hero Section ────────────────────────────────────── */}
      <section className="w-full max-w-[1200px] px-6 pt-32 pb-24">
        <div className="max-w-[640px]">
          <h1 className="text-[40px] leading-[48px] font-medium tracking-[-0.025em] text-[var(--text-primary)] font-[family-name:var(--font-display)]">
            Compare phones.
            <br />
            <span className="text-[var(--text-secondary)]">
              Decide with clarity.
            </span>
          </h1>

          <p className="mt-6 text-[17px] leading-[28px] text-[var(--text-secondary)] max-w-[480px]">
            Side-by-side specs, curated news, and AI-powered recommendations —
            everything you need to make the right choice.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/phones"
              className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-[var(--accent)] px-6 text-[15px] font-medium text-white transition-opacity duration-[150ms] hover:opacity-90"
            >
              Browse Phones
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/compare"
              className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[var(--border)] px-6 text-[15px] font-medium text-[var(--text-primary)] transition-opacity duration-[150ms] hover:opacity-80"
            >
              Compare
            </Link>
          </div>
        </div>
      </section>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="w-full max-w-[1200px] px-6">
        <div className="border-t border-[var(--divider)]" />
      </div>

      {/* ── Value Props ─────────────────────────────────────── */}
      <section className="w-full max-w-[1200px] px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: Smartphone,
              title: "Every spec, organized",
              description:
                "Clean device profiles with the specs that actually matter. No clutter, no information overload.",
            },
            {
              icon: BarChart3,
              title: "Side-by-side clarity",
              description:
                "Compare devices with visual bars and clear winner highlights. See the difference in seconds.",
            },
            {
              icon: Zap,
              title: "AI-powered insights",
              description:
                "Get personalized recommendations based on your priorities — gaming, camera, battery, value.",
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--accent-subtle)]">
                <item.icon className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <h3 className="text-[20px] leading-[28px] font-medium text-[var(--text-primary)] font-[family-name:var(--font-display)]">
                {item.title}
              </h3>
              <p className="text-[15px] leading-[24px] text-[var(--text-secondary)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="w-full max-w-[1200px] px-6">
        <div className="border-t border-[var(--divider)]" />
      </div>

      {/* ── Bottom CTA ──────────────────────────────────────── */}
      <section className="w-full max-w-[1200px] px-6 py-24 text-center">
        <h2 className="text-[28px] leading-[36px] font-medium text-[var(--text-primary)] font-[family-name:var(--font-display)]">
          Ready to find your next phone?
        </h2>
        <p className="mt-4 text-[15px] text-[var(--text-secondary)]">
          No sign-up required. Start comparing instantly.
        </p>
        <div className="mt-8">
          <Link
            href="/phones"
            className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-[var(--accent)] px-6 text-[15px] font-medium text-white transition-opacity duration-[150ms] hover:opacity-90"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
