import Link from "next/link";
import ComparisonHero from "@/components/compare/ComparisonHero";
import AIVerdict from "@/components/compare/AIVerdict";
import CategoryWinners from "@/components/compare/CategoryWinners";
import ExperienceDifferences from "@/components/compare/ExperienceDifferences";
import SpecComparison from "@/components/compare/SpecComparison";
import SmartAlternatives from "@/components/compare/SmartAlternatives";
import DecisionCTA from "@/components/compare/DecisionCTA";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: { a?: string; b?: string };
}) {
  const { a: slugA, b: slugB } = searchParams;
  
  // A temporary UI for picking devices via URL until a full selector is built
  if (!slugA || !slugB) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-semibold mb-6">Compare Devices</h1>
        <p className="text-text-secondary mb-8 text-center max-w-lg">
          Select two devices to compare. For now, you can try comparing specific devices by passing them directly in the URL:
        </p>
        <div className="bg-surface p-6 rounded-2xl border border-border-subtle mb-6">
          <code className="text-accent">/compare?a=iphone-16-pro&b=galaxy-s24-ultra</code>
        </div>
        <Link 
          href="/compare?a=iphone-16-pro&b=galaxy-s24-ultra" 
          className="bg-accent text-accent-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
        >
          View Demo Comparison
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary antialiased font-sans selection:bg-surface selection:text-accent-foreground">
      <main className="flex flex-col items-center overflow-x-hidden">
        {/* Placeholder components: They need to be updated to accept dynamic props. */}
        {/* Currently they hardcode iPhone vs Galaxy */}
        <ComparisonHero slugA={slugA} slugB={slugB} />
        <AIVerdict />
        <CategoryWinners />
        <ExperienceDifferences />
        <SpecComparison />
        <SmartAlternatives />
        <DecisionCTA />
      </main>
    </div>
  );
}
